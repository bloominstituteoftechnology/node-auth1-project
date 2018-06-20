import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Login from './Components/Login';
import Register from './Components/Register';
import UsersList from './Components/UsersList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component ={Login} />
          <Route path='/login' component ={Login} />
          <Route path='/restricted/users' component ={UsersList} />
          <Route path='/register' component ={Register}/>
        </Switch>
      </div>
    );
  }
}

export default App;
