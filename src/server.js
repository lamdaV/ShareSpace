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
const { query, validationResult } = require("express-validator/check");
const { sanitizeQuery } = require("express-validator/filter");

const app = express();
const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
const dbx = new Dropbox({fetch, accessToken});

app.set("host", process.env.HOST || "localhost");
app.set("port", process.env.PORT || 8080);

app.use(expressStatusMonitor());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());

const OK = 200;
const CLIENT_ERRROR = 404;
const SERVER_ERROR = 500

app.all("*", (request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "OPTIONS, PUT, GET, POST");
  response.header("Access-Control-Allow-Headers", "Content-Type");

  request.header("Accept", "application/json");
  request.header("Accept-Language", "en-US");

  console.log(`${request.method} ${request.originalUrl} hit with: query => ${JSON.stringify(request.query)} body => ${JSON.stringify(request.body)}`);

  next();
});

const usernameValidation = [
  query("username")
    .exists()
    .withMessage("Missing Stock Symbol")
    .isString()
    .withMessage("Symbol must be a String")
    .not().isEmpty()
    .withMessage("Symbol cannot be empty"),
  sanitizeQuery("symbol")
    .customSanitizer((symbol) => symbol.toLowerCase())
];
app.get("/user/list", usernameValidation, (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(CLIENT_ERRROR)
      .json({errors: errors.array()});
  }

  const username = request.query.username;
  dbx.filesListFolder({path: `/${username}`})
    .then((res) => response.status(OK).send(res.entries))
    .catch((error) => response.status(SERVER_ERROR).send({errors: error.error}));
});

dbx.upload

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
