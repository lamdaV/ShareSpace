import React, { Component } from "react";
import { Alert, Card, CardBody, CardHeader, Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import { Redirect } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: "",
      password1: "",
      password2: "",
      invite: "",
      errors: [],
      registerEnabled: false,
      toUserPage: false
    }

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPassword1Change = this.onPassword1Change.bind(this);
    this.onPassword2Change = this.onPassword2Change.bind(this);
    this.onInviteChange = this.onInviteChange.bind(this);

    this.onRegister = this.onRegister.bind(this);
  }

  onUsernameChange(event) {
    event.preventDefault();
    const username = event.currentTarget.value;
    const password1 = this.state.password1;
    const password2 = this.state.password2;
    const invite = this.state.invite;
    this.updateState(username, password1, password2, invite);
  }

  onPassword1Change(event) {
    event.preventDefault();
    const username = this.state.username;
    const password1 = event.currentTarget.value;
    const password2 = this.state.password2;
    const invite = this.state.invite;
    this.updateState(username, password1, password2, invite);
  }

  onPassword2Change(event) {
    event.preventDefault();
    const username = this.state.username;
    const password1 = this.state.password1;
    const password2 = event.currentTarget.value;
    const invite = this.state.invite;
    this.updateState(username, password1, password2, invite);
  }

  onInviteChange(event) {
    event.preventDefault();
    const username = this.state.username;
    const password1 = this.state.password1;
    const password2 = this.state.password2
    const invite = event.currentTarget.value;
    this.updateState(username, password1, password2, invite);
  }

  updateState(username, password1, password2, invite) {
    const errors = [];
    if (username.length === 0) {
      errors.push("username must be non-empty");
    } else if (username.length < 5) {
      errors.push("username must be more than 5 characters");
    }

    if (password1.length === 0) {
      errors.push("password must be non-empty")
    } else if (password1.length < 5) {
      errors.push("password must be more than 5 characters")
    } else if (password1.length > 32) {
      errors.push("password must be less than 32 characters")
    } else if (!password1.match(/^[a-zA-Z0-9]+$/)) {
      errors.push("password must be alpha-numeric")
    }

    if (password1 !== password2) {
      errors.push("passwords do not match");
    }

    if (invite.length === 0) {
      errors.push("invite must not be empty");
    }

    const registerEnabled = errors.length === 0;
    this.setState({username, password1, password2, errors, registerEnabled, invite});
  }

  onRegister(event) {
    event.preventDefault();
    this.props.service.register(this.state.username, this.state.password1, this.state.invite)
      .then((res) => {
        this.setState({errors: [], toUserPage: true});
        this.props.store.publish("auth", true);
      })
      .catch((error) => {
        if (error.response) {
          const errors = error.response.data.errors;
          const messages = errors.map((err) => err.msg)
          this.setState({errors: messages});
        }
        this.props.store.publish("auth", false);
      });
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
        <CardHeader>Registration</CardHeader>
        <CardBody>
          {errorMessages}
          <InputGroup>
            <InputGroupAddon addonType="prepend">username</InputGroupAddon>
            <Input required type="text" value={this.state.username} onChange={this.onUsernameChange}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupAddon addonType="prepend">password</InputGroupAddon>
            <Input required type="password" value={this.state.password1} onChange={this.onPassword1Change}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupAddon addonType="prepend">password</InputGroupAddon>
            <Input required type="password" value={this.state.password2} onChange={this.onPassword2Change}/>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupAddon addonType="prepend">invite</InputGroupAddon>
            <Input required type="text" value={this.state.invite} onChange={this.onInviteChange}/>
          </InputGroup>
          <br/>
          <Button color="success" block onClick={this.onRegister} disabled={!this.state.registerEnabled}>Register</Button>
        </CardBody>
      </Card>
    );
  }
}

export default Register;