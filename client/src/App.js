import React, { Component } from 'react';
import logo from './logo.svg';
import { Route } from 'react-router-dom';
import './App.css';
import Register from './components/register'
import Login from './components/login';
import Home from './components/home';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Route exact path="/" component={Home} />
        <Route exact path="/api/login" component={Login} />
        <Route exact path="/api/register" component={Register} />
      </div>
    );
  }
}

export default App;
