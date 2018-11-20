import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Alert, Card, CardBody, CardHeader, Input, InputGroup, InputGroupAddon, Button } from "reactstrap";

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: "",
      password: "",
      errors: [],
      toUserPage: false
    }

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.listFiles = this.listFiles.bind(this);
  }

  onUsernameChange(event) {
    event.preventDefault();
    const username = event.currentTarget.value;
    this.setState({username});
  }

  onPasswordChange(event) {
    event.preventDefault();
    const password = event.currentTarget.value;
    this.setState({password});
  }

  onLogin(event) {
    event.preventDefault();
    this.props.service.login(this.state.username, this.state.password)
      .then((res) => {
        this.setState({errors: [], toUserPage: true})
        this.props.store.publish("auth", true);
      })
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data.errors;
          const messages = errors.map((err) => err.msg)
          this.setState({errors: messages});
        }
        this.props.store.publish("auth", false);
      })
  }

  listFiles(event) {
    event.preventDefault();
    this.service.listFiles();
  }

  render() {
    let errorMessages = null;
    if (this.state.errors) {
      errorMessages = this.state.errors.map((error, index) => {
        return (
          <Alert key={`error ${index}`} color="danger">{error}</Alert>
        );
      })
    }
    return (
      <Card>
        {this.state.toUserPage ? <Redirect to="/user"/> : null}
        <CardHeader>Login</CardHeader>
        <CardBody>
          {errorMessages}
          <InputGroup>
            <InputGroupAddon addonType="prepend">username</InputGroupAddon>
            <Input required type="username" value={this.state.username} onChange={this.onUsernameChange}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupAddon addonType="prepend">password</InputGroupAddon>
            <Input required type="password" value={this.state.password} onChange={this.onPasswordChange}/>
          </InputGroup>
          <br/>
          <Button color="primary" block onClick={this.onLogin}>Login</Button>
          <Button color="primary" block onClick={this.listFiles}>ListFiles</Button>
        </CardBody>
      </Card>
    );
  }
}

export default Login;