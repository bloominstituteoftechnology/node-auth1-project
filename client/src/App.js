import React, { Component } from 'react';
import axios from 'axios';
// import {Route, Link} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import LoginForm from '../src/components/LoginForm'


class App extends Component {
  constructor(){
    super();
    this.state = {
      users: [],
      username: '',
    }
  }

componentDidMount() {
  axios
    .get('http://localhost:5000/api/users')
    .then(response => {
      this.setState(() => ({users: [...response.data]}));
    })
    .catch(err => {
      console.log("error", err)
    });
}

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React Friends</h1>
        </header>
        <ul>
          {this.state.users.map(user => {
            return (
              <li key={user}>
                <p>Username: {user.username}</p>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default App;
