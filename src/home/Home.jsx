import React, { Component } from "react";
import { Redirect } from "react-router-dom"
import { Col, Row } from "reactstrap";
import Login from "./Login";
import Register from "./Register";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMounted: false,
      toUserPage: false
    };
  }

  componentDidMount() {
    this.props.service.verify()
      .then((res) => {
        this.setState({hasMounted: true, toUserPage: true});
        this.props.store.publish("auth", true);
      })
      .catch((error) => {
        this.setState({hasMounted: true, toUserPage: false});
        this.props.store.publish("auth", false);
      });
  }

  render() {
    let component = null;
    if (this.state.hasMounted) {
      if (this.state.toUserPage) {
        component = (<Redirect to="/user"/>);
      } else {
        component = (
          <Row>
            <Col md="6">
              <Login service={this.props.service} store={this.props.store}/>
            </Col>

            <Col md="6">
              <Register service={this.props.service} store={this.props.store}/>
            </Col>
          </Row>
        );
      }
    }

    return component;
  }
}

export default Home;