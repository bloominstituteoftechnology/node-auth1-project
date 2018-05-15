import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios"
import {Route, Switch} from "react-router-dom"
import Register from "./components/register/register"
import Home from "./components/Home/Home"

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
        <Route exact path="/register" component={Register}/>
      </Switch>
    );
  }
}

export default App;
