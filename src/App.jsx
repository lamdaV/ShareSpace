import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "./nav/Navigation";
import Home from "./home/Home";
import Logout from "./logout/Logout";
import { Container, Row, Col } from "reactstrap";
import BackendService from "./service/BackendService";
import StateObserver from "./service/StateObserver";
import User from "./user/User";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toUserPage: false
    }

    this.service = new BackendService(process.env.REACT_APP_API_ENDPOINT);
    this.stateObserver = new StateObserver();
  }

  render() {
    return (
      <Router>
        <Container fluid>          
          <Row>
            <Col md="12">
              <Navigation store={this.stateObserver}/>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Route path="/" exact render={(props) => <Home {...props} service={this.service} store={this.stateObserver}/>}/>
              <Route path="/logout" exact render={(props) => <Logout {...props} service={this.service} store={this.stateObserver}/>}/>
              <Route path="/user" exact render={(props) => <User {...props} service={this.service} store={this.stateObserver}/>}/>
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

export default App;
