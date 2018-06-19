import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './index.css';
import Header from "./Header";
import UserList from "./UserList";

class App extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Header}/>
        <Route exact path ="/login" component={Header}/>
        <Route path="/restricted/users" component={UserList}/>
      </Switch>
    );
  }
}

export default App;
