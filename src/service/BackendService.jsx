import axios from "axios";

class BackendService {
  constructor(endpoint) {
    this.service = axios.create({baseURL: endpoint, withCredentials: true});
  }

  verify() {
    return this.service.get("/verify");
  }

  register(username, password) {
    return this.service.post("/register", {username, password});
  }

  login(username, password) {
    return this.service.post("/login", {username, password});
  }

  logout() {
    return this.service.get("/logout");
  }

  listFiles() {
    return this.service.get("/user/list");
  }
}

export default BackendService;