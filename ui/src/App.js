import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link class='main-links' to='/register'>Register</Link>
        <Link class='main-links' to='/login'>Login</Link>
        <Link class='main-links' to='/users'>Users</Link>
      </div>
    );
  }
}

export default App;
