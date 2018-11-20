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

  listFiles(path = null) {
    if (path) {
      return this.service.get("/user/list", {params: {path}});
    }
    return this.service.get("/user/list");
  }

  download(path) {
    return this.service.get("/user/download", {params: {path}, responseType: "blob"});
  }

  delete(path) {
    return this.service.delete("/user/delete", {params: {path}});
  }
}

export default BackendService;