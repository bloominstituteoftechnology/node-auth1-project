import React, { Component } from 'react';

import './App.css';

import AddUser from './components/AddUser';
import UserLogin from './components/UserLogin';

class App extends Component {
  render() {
    return (
      <div className="App">
        
        <AddUser />
        <UserLogin />

      </div>
    );
  }
}

export default App;
