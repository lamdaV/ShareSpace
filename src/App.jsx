import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./home/Home";

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Home}/>
      </Router>
    );
  }
}

export default App;
