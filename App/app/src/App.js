import React, { Component } from 'react';
import './App.css';
import Login from './components/login/login';
import { Route, Link } from "react-router-dom";


class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        <Link to="/login">Login</Link>
        <Route path="/login" exact component={Login} />
      </div>
    );
  }
}

export default App;
