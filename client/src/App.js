import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router'
import Register from './components/Register.js'
import Home from './components/Home.js'
import Login from './components/Login.js'
import Users from './components/Users.js'

class App extends Component {
  constructor() {
    super();
    this.state = {}

  }
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/users" component={Users} /> 
      </Switch>
    );
  }
}

export default App;
