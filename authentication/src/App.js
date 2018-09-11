import React, { Component } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import {Link, Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to='/register'>Register</Link>
        <Link to='/login'>Login</Link>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </div>
    );
  }
}

export default App;
