import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import LogIn from './components/LogIn';
import {Route} from 'react-router-dom';
import UserInfo from './components/UserInfo';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Navigation />
        <Route path={'/login'} component={LogIn} />
        <Route path={'/user-info'} component={UserInfo} />
      </div>
    );
  }
}

export default App;
