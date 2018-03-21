import React, { Component } from 'react';
import './App.css';
import UserForm from './components/UserForm';
import Users from './components/Users';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>Users</div>
        <UserForm />
        <Users />
      </div>
    );
  }
}

export default App;
