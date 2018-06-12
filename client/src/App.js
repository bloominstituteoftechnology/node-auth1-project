import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// Pages
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Users from './pages/Users';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <h1>Ron's Silly App</h1>
        <Switch>
          <Route exact path='/' component={Welcome} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Login} />
          <Route path='/users' component={Users} />
          <Route render={() => <h1>404: Not found</h1>} />
        </Switch>
      </div>
    );
  }
}

export default App;
