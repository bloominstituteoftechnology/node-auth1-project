import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';

import UsersList from './components/UsersList.js';

class App extends Component {
  state = {
    users: [],
    username: ''
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3500/api/users`)
      .then(response => {
        // console.log(response.data);
        this.setState({ users: response.data.users });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div>
          <UsersList users = {this.state.users} />
        </div>
      </div>
    );
  }
}

export default App;
