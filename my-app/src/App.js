import React, { Component } from 'react';
import './App.css';
// import axios from "axios"
import {Route, Switch} from "react-router-dom"
import Register from "./components/register/register"
import Home from "./components/Home/Home"
import Login from "./components/Login/Login"


class App extends Component {
  constructor() {
    super();
    this.state={
      mounted: false
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login"  component={Login}/>
        <Route exact path="/register" component={Register}/>
      </Switch>
    );
  }
}

export default App;
