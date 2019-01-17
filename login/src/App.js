import React, { Component } from 'react';
import './App.css';
import { Route, Link } from 'react-router-dom';
import Register from './components/register';
import Home from './components/home';
import Login from './components/login';
import Users from './components/users';


class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="navBar">
          <Link to="/" cstyle={{textDecoration: 'none', color: 'black'}}>Home</Link>
          <Link to="/register" className="navlink">Register</Link>
          <Link to="/login" className="navlink">Login</Link>
          <Link to='/users' className="navlink">Users</Link>
        </nav>

        <Route path="/register" render={ props => <Register/>} />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route path="/users" component={Users} />

      </div>
    );
  }
}

export default App;
