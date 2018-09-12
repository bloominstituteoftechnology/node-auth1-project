import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import Login from './components/login';
import axios from 'axios';
import Users from './components/users';

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    }
  }


  render() {
    return (
      <div className="App">
       <Route exact path="/login" component={Login}/>
       <Route exact path="/users" component={Users}/>
      </div>
    );
  }
}

export default App;
