import React, { Component } from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
import {
  GoSignOut
} from "react-icons/go";

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: false
    }

    this.unsubscribe = () => null;
  }

  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe("auth", "Navigation", (auth) => {
      this.setState({auth})
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Navbar light>
        <NavbarBrand tag={Link} to={"/"}>SpaceShare</NavbarBrand>
        <Nav navbar>
          {this.state.auth 
            ? <NavItem>
                <NavLink tag={Link} to="/logout" id="logout">
                  <GoSignOut/>
                </NavLink>
                <UncontrolledTooltip placement="left" target="logout">
                  Logout
                </UncontrolledTooltip>
              </NavItem>
            : null}
        </Nav>
      </Navbar>
    );
  }
}

export default Navigation;