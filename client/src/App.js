import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';

import Users from './users/Users';
import Signin from './auth/Signin';

import './App.css';

const Home = props => {
  return (
    <div>
      <h1>Home Component</h1>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            <NavLink to="/" exact>
              Home
            </NavLink>
            &nbsp;|&nbsp;
            <NavLink to="/users">Users</NavLink>
            &nbsp;|&nbsp;
            <NavLink to="/signin">Signin</NavLink>
            <button onClick={this.signout}>Signout</button>
          </nav>
          <main>
            <Route path="/" component={Home} exact />
            <Route path="/users" component={Users} />
            <Route path="/signin" component={Signin} />
          </main>
        </header>
      </div>
    );
  }
  signout = ()=>{
    localStorage.removeItem('jwt');
  }
}

export default App;