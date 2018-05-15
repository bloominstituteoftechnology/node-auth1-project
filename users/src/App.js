import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import UserForm from "./components/UserForm";

class App extends Component {
  state = {
    users: [],
    loggedIn: false
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <UserForm />
      </div>
    );
  }
}

export default App;
