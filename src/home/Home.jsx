import React, { Component } from "react";
import { Container, Col, Row } from "reactstrap";
import Login from "./Login";

class Home extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col md="6">
            <Login/>
          </Col>

          <Col md="6">
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;