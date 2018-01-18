import React, { Component } from 'react';
import { BroswerRouter, Route } from 'react-router-dom';

import './App.css';
import Nav from './components/Nav/Nav';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';

class App extends Component {
  render() {
    return (
      <BroswerRouter>
        <div>
          <Nav />
          <Route exact path="/" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/Profile" component={Profile} />
        </div>
      </BroswerRouter>
    );
  }
}

export default App;
