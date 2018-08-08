import React, { Component } from "react";
import "./App.css";
import { Route, Link } from "react-router-dom";
import Register from "./components/Register";
import LoginPage from "./components/LoginPage";
import Users from "./components/Users";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={LoginPage} />
        <Route path="/register" component={Register} />
        <Route path="/Users" component={Users} />
      </div>
    );
  }
}

export default App;
