import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import Login from "../Login";
import Register from "../Register";

import "./index.css";

class App extends Component {
  // constructor for later refactoring
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      hasLoggedIn: false,
      currentUser: null,
      loginPage: false,
      regPage: false
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the authentication app</h1>
          <Link className="button" to="/login">
            Login
          </Link>
          <br />
          <Link className="button" to="/register">
            Register
          </Link>
        </header>
      </div>
    );
  }
}

export default App;
