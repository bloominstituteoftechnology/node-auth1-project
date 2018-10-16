import React, { Component } from 'react';
import { Route, NavLink, withRouter } from 'react-router-dom';
import cookie from 'react-cookie';
import styled from 'styled-components';

import Home from './components/Home';
import Login from './components/Login';
import Users from './components/Users';

import logo from './logo.svg';
import './App.css';

const Button = styled.button`
  text-align: center;
  background-color: #24B8BD;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  width: 200px;
  height: 3rem;
  margin: 0.5rem 0;
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <NavLink to="/login" activeClassName="activeNavButton">
          <Button>
            Log In
            </Button>
            </NavLink>
            <NavLink to="/users" activeClassName="activeNavButton">
          <Button>
            Users List
            </Button>
            </NavLink>
        </header>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/login" component={Login} />
      </div>
    );
  }
}

export default withRouter(App);
