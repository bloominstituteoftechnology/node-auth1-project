import React, { Component } from 'react';
import Axios from 'axios';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const dbURL = 'http://localhost:5000';

class App extends Component {
  state = {
    loggedIn: false,
    data: [],
  };

  registerUser = (e, user) => {
    e.preventDefault();
    Axios.post(`${dbURL}/api/register`, user)
      .then(res => {})
      .catch(err => console.log(err));
  };
  loginUser = (e, user) => {
    e.preventDefault();
    Axios.post(`${dbURL}/api/login`, user)
      .then(res => {
        this.setState({ data: res.data, loggedIn: true });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        {this.state.loggedIn ? (
          <h1>Welcome to the app!</h1>
        ) : (
          <>
            <LoginForm loginUser={this.loginUser} />
            <RegisterForm registerUser={this.registerUser} />
          </>
        )}
      </div>
    );
  }
}

export default App;
