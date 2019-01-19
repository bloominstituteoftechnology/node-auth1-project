import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';

import Register from './components/register';
import Welcome from './components/welcome';
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
  }
  render() {
    return (
      <div className="App">
        <div classname="register">
          <Route exact path="/" render={(props) => <Welcome />} />
          <Route exact path="/register" render={(props) => <Register registerUser={this.registerUser} />} />
          
        </div>
      </div>
    );
  }
}

export default App;
