import axios from "axios";

class BackendService {
  constructor(endpoint) {
    this.service = axios.create({baseURL: endpoint});
  }

  register(username, password) {
    return this.service.post("/register", {username, password});
  }

  login(username, password) {
    return this.service.post("/login", {username, password})
      .then((res) => console.log(res));
  }

  listFiles() {
    return this.service.get("/user/list");
  }
}

export default BackendService;