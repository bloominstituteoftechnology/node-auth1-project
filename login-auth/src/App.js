import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './components/login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-title">Week 11 - Authentication</h1>
        <Login />
      </div>
    );
  }
}

export default App;
