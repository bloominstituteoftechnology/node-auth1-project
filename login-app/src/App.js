import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      'isLoggedIn': false,
      'user': null,
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Login Below to Continue.
        </p>
        <form action="" method='POST'>
        <input placeholder='username' type="text"/>
        <input placeholder='password' type="text"/>
        <button>submit</button>
        </form>
      </div>
    );
  }
}

export default App;
