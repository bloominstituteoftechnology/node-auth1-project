import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import UserForm from "./components/UserForm";
import { Route, Switch } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Users from "./components/Users";
import Home from "./components/Home";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route path="/login/" component={LoginForm} />
        <Route path="/register/" component={RegisterForm} />
      </Switch>
    );
  }
}

export default App;
