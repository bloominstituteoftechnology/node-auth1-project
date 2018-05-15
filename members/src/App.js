import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';

// Routing components
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';

export default class App extends Component {
  constructor() {
    super();
    this.state = {}
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">MEMBERS</h1>
        </header>
        <div>
          <Route exact path = '/'component = { Welcome } />
          <Route path = '/login' component = { Login } />
          <Route path = '/register' component = { Register } />
          <Route path = '/users' component = { UserList } />
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </div>
    );
  }
}
