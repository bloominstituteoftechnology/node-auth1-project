import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom'
import InputF from './components/Input'
import { UserList } from './components/UsersList'

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Welcome to this awesome backend Project!</h1>
        <Link to="/register"><h5>If you haven't got an account yet, please register here</h5></Link>
        <Link to="/login"><h5>Sign In Here</h5></Link>
        <Route exact path="/register" component={InputF} />
        <Route exact path="/login" component={InputF} />
        <Route exact path="/users" component={UserList} />
      </div>
    );
  }
}

export default App;
