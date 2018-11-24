import axios from "axios";

class BackendService {
  constructor(endpoint) {
    this.service = axios.create({baseURL: endpoint, withCredentials: true});
  }

  verify() {
    return this.service.get("/api/verify");
  }

  register(username, password, invite) {
    return this.service.put("/api/register", {username, password, invite});
  }

  login(username, password) {
    return this.service.post("/api/login", {username, password});
  }

  logout() {
    return this.service.get("/api/logout");
  }

  listFiles(path = null) {
    if (path) {
      return this.service.get("/api/user/list", {params: {path}});
    }
    return this.service.get("/api/user/list");
  }

  download(path) {
    return this.service.get("/api/user/download", {params: {path}, responseType: "blob"});
  }

  delete(path) {
    return this.service.delete("/api/user/delete", {params: {path}});
  }

  rename(oldPath, newPath) {
    return this.service.post("/api/user/rename", {oldPath, newPath});
  }

  upload(file, path) {
    const formData = new FormData();
    formData.append("file", file, file.name);
    if (path) {
      formData.append("path", path);
    }
    return this.service.put("/api/user/upload", formData);
  }

  createDirectory(path, directory) {
    if (path) {
      return this.service.put("/api/user/directory", {directory});
    } 
    return this.service.put("/api/user/directory", {path, directory});
  }
}

export default BackendService;