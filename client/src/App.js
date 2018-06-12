import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1> */}
        </header>
        <div className="App-intro">
          <Link to ='/register'>
            <p>
              Click this link to register for an account
            </p>
          </Link>

        </div>
      </div>
    );
  }
}

export default App;
