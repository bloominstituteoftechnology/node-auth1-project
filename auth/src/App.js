import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Route, Switch } from "react-router-dom";
// import UserForm from "./components/UserForm";
import RegisterForm from "./components/RegisterForm";
// import LoginForm from "./components/LoginForm";
// import Users from "./components/Users";
import Home from "./components/Home";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={Home}/>
        {/* <Route exact path="/users" component={Users} /> */}
        {/* <Route path="/login/" component={LoginForm} /> */}
        <Route path="/register/" component={RegisterForm} />
      </div>
    );
  }
}

export default App;
