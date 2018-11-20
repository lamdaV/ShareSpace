require("dotenv").config();
const fetch = require("isomorphic-fetch");
const Dropbox = require("dropbox").Dropbox;
const express = require("express");
const expressStatusMonitor = require("express-status-monitor");
const errorhandler = require("errorhandler");
const bodyParser = require("body-parser");
const compression = require("compression");
const expressValidator = require("express-validator");
const axios = require("axios");
const { body, query, cookie, validationResult } = require("express-validator/check");
const { sanitizeQuery } = require("express-validator/filter");
const firebase = require("firebase");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
const dbx = new Dropbox({fetch, accessToken});

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
});
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_SIGNATURE = process.env.COOKIE_SIGNATURE;

app.set("host", process.env.HOST || "localhost");
app.set("port", process.env.PORT || 8080);

app.use(expressStatusMonitor());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser(COOKIE_SIGNATURE));
app.use(compression());

const OK = 200;
const CLIENT_ERRROR = 404;
const SERVER_ERROR = 500

app.all("*", (request, response, next) => {
  // response.header("Access-Control-Allow-Origin", "*");
  // response.header("Access-Control-Allow-Methods", "OPTIONS, PUT, GET, POST");
  // response.header("Access-Control-Allow-Headers", "Content-Type");
  // response.header("Access-Control-Allow-Credential", "true");

  request.header("Accept", "application/json");
  request.header("Accept-Language", "en-US");

  console.log(`${request.method} ${request.originalUrl} hit with: query => ${JSON.stringify(request.query)} body => ${JSON.stringify(request.body)} cookie => ${JSON.stringify(request.cookies)}`);

  next();
});

const sendJWT = (response, token) => {
  return response.cookie("jwt", token, {maxAge: 30 * 60 * 1000, httpOnly: true})
    .status(OK)
    .send();
}
const serverError = (response, error) => {
  console.error(error);
  return response.status(SERVER_ERROR)
    .send({errors: [error.message]});
}
const authValidation = [
  body("username")
    .exists()
    .withMessage("Missing username")
    .isString()
    .withMessage("username is not a string")
    .not().isEmpty()
    .withMessage("username is empty"),
  body("password")
    .exists()
    .withMessage("Missing password")
    .isString()
    .withMessage("password is not a string")
    .not().isEmpty()
    .withMessage("password is empty")
];
app.post("/api/register", authValidation, (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(CLIENT_ERRROR)
      .json({errors: errors.array()});
  }

  const username = request.body.username;
  const password = request.body.password;

  const usersCollection = db.collection("users");
  usersCollection
    .where("username", "==", username)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        bcrypt.hash(password, SALT_ROUNDS)
          .then((hashword) => {
            usersCollection.add({username, hashword})
              .then((userRef) => {
                dbx.filesCreateFolderV2({path: `/${username}`})
                  .then((result) => {
                    const token = jwt.sign({username}, JWT_SECRET)
                    return sendJWT(response, token);
                  })
                  .catch((error) => {
                    // failed to create folder
                    return serverError(response, error);
                  })
              })
              .catch((error) => {
                // failed to add user
                return serverError(response, error);
              });
          })
          .catch((error) => {
            // failed to generate hashword
            return serverError(response, error);
          })
      } else {
        // non-unique username
        response.status(CLIENT_ERRROR)
          .json({message: "username taken"});
      }
    })
});


const failLogin = (response) => {
  return response.status(CLIENT_ERRROR)
    .send("invlaid username or password");
}
app.post("/api/login", authValidation, (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(CLIENT_ERRROR)
      .json({errors: errors.array()});
  }

  const username = request.body.username;
  const password = request.body.password;

  const usersCollection = db.collection("users");
  usersCollection.where("username", "==", username)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        if (snapshot.size === 1) {
          snapshot.forEach((userRef) => {
            const user = userRef.data();
            bcrypt.compare(password, user.hashword)
              .then((result) => {
                if (result) {
                  const token = jwt.sign({username}, JWT_SECRET)
                  return sendJWT(response, token);
                } else {
                  return failLogin(response);
                }
              })
              .catch((error) => {
                // bcrypt error
                return serverError(response, error);
              })
          });
        } else {
          // username is not unique
          return failLogin(response);
        }
      } else {
        // No user with username
        return failLogin(response);
      }
    })
    .catch((error) => {
      // firebase error
      return serverError(response, error);
    })
});

const clearJWT = (response, status = CLIENT_ERRROR) => {
  return response.status(status)
    .clearCookie("jwt")
    .send();
}
const jwtValidation = [
  cookie("jwt")
    .exists()
    .withMessage("Missing jwt cookie")
    .isString()
    .withMessage("jwt must be a String")
    .not().isEmpty()
    .withMessage("jwt cannot be empty")
];
app.get("/api/verify", jwtValidation, (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return clearJWT(response);
  } else {
    const token = request.cookies.jwt;
    jwt.verify(token, JWT_SECRET, (error, payload) => {
      if (error) {
        return clearJWT(response);
      } 
      return response.status(OK)
        .send();
    })
  }
});

app.get("/api/logout", jwtValidation, (request, response) => {
  return clearJWT(response, OK);
});

app.get("/api/user/list", jwtValidation, (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(CLIENT_ERRROR)
      .json({errors: errors.array()});
  }

  const token = request.cookies.jwt;
  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      return clearJWT(response);
    }
    const username = payload.username;
    dbx.filesListFolder({path: `/${username}`})
      .then((res) => response.status(OK).send(res.entries))
      .catch((error) => response.status(SERVER_ERROR).send({errors: error.error}));
  });
});

if (process.env.NODE_ENV !== "production") {
  app.use(errorhandler());
}

app.listen(app.get("port"), (error) => {
  if (error) {
    console.log(`Server failed to start: ${error}`);
  } else {
    console.log(`Server listening on ${app.get("host")}:${app.get("port")}`);
  }
});
