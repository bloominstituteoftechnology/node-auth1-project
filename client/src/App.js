import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
      </div>
    );
  }
}

export default App;
