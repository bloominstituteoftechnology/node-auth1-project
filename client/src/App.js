import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import UserList from './components/UserList';
import Login from './components/Login';

class App extends Component {
  state = {
    users: [],
  };

  updateUser() {
    axios
      .get('http://localhost:4400/api/users')
      .then(response => console.log(response))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <h1>Users List</h1>
        <UserList users={this.state.users} />
        <Login updateUser={this.updateUser} />
      </div>
    );
  }
}

export default App;
