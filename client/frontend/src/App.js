import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';

import Register from './components/register';
import Welcome from './components/welcome';
import Login from './components/Login';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  registerUser = (username, password) => {
    axios.post('http://localhost:5000/api/register', {
      username: username,
      password: password
    })
    .then(response => {
      console.log(response)
    })
    .catch(err => console.log('error creating user', err))
  };

  loginUser = (username, password) => {
    axios.post('http://localhost:5000/api/login', {
      username: username,
      password: password
    })
    .then(response => {
      console.log('logged in!', response)
    })
    .catch(err => console.log('error logging in user', err))
  };

  render() {
    return (
      <div className="App">
          <Route exact path="/" render={(props) => <Welcome />} />
          <Route exact path="/register" render={(props) => <Register {...props} registerUser={this.registerUser} />} />
          <Route exact path="/login" render={(props) => <Login {...props} loginUser={this.loginUser} />} />
      </div>
    );
  }
}

export default App;
