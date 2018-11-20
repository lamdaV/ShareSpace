import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logout: false
    };
  }

  componentDidMount() {
    this.props.service.logout()
      .then((res) => {
        this.setState({logout: true});
        this.props.store.publish("auth", false);
      })
      .catch((error) => {
        this.setState({logout: true});
        this.props.store.publish("auth", false);
      });
  }

  render() {
    return (
      this.state.logout ? <Redirect to="/"/> : null
    );
  }
}

export default Logout;