import { Route, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import axios from 'axios';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Switch>
          <Route exact path='/' component={Greeting} />
          <Route exact path='/api/login' component={Login} />
          <Route exact path='/api/register' component={Register} />
        </Switch>
      </div>
    );
  }
}

export default App;
