import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import Home from './components/general/Home';
import Login from './components/authentication/Login';
import UserList from './components/users/UserList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} /> 
        <Route path="/users" component={UserList} />
      </div>
    );
  }
}

export default App;
