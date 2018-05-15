import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './components/login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Week 11 - Authentication</h1>
        </header>
        <Login />
      </div>
    );
  }
}

export default App;
