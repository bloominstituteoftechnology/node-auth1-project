import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import Nav from './Nav/nav';
import Home from './Home/home';
import RegisterForm from './RegisterForm/registerform';
import LoginForm from './LoginForm/loginform';
import UsersList from './UsersList/userlist';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Route exact path='/' component={Home} />
        <Route path='/register' component={RegisterForm} />
        <Route path='/login' component={LoginForm} />
        <Route path='/userslist' component={UsersList} />
      </div>
    );
  }
}

export default withRouter(App);
