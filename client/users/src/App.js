import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserList from "./components/UserList";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/register" component={Register}/>
          <Route path ="/login" component={Login}/>
          <Route path="/users" component={UserList}/>
        </Switch>
      </div>
    );
  }
}

export default App;
