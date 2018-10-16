import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import Nav from './Nav/nav';
import Home from './Home/home';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Route exact path='/' component={Home} />
      </div>
    );
  }
}

export default withRouter(App);
