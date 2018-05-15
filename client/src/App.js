import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import Login from './Components/login';
import Register from './Components/register';
import Users from './Components/users';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      users: [],
      username: '',
      password:''
    };
  }

  toggleNavbar = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return <div>
        <Navbar color="dark" light expand="md">
          <NavbarBrand href="/" className="text-white">
            UsersBook
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="text-white" href="/login">
                  Login
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="text-white" href="/register">
                  Register
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/users' component={Users} />
      </div>;
  }
}

export default App;
