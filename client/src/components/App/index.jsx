import React, { Component } from "react";
import Login from "../Login";
import Register from "../Register";

import "./index.css";

class App extends Component {
  state = {
    username: "",
    password: "",
    hasLoggedIn: false,
    currentUser: null,
    loginPage: false,
    regPage: false
  };

  loginPage() {}

  regPage() {}

  inputChangeHandler() {}
  render() {
    if (this.state.currentUser !== null) {
      return (
        <div>
          <h1>Welcome to your page {this.state.currentUser.username}</h1>
          <p>
            This is a restricted are and only {this.state.currentUser.username}
            is permitted to view it.
          </p>
        </div>
      );
    }
    if (this.state.loginPage) {
      return <Login inputHandler={this.inputHandler} />;
    }
    if (this.state.regPage) {
      return <Register inputHandler={this.inputHandler} />;
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the authentication app</h1>
          <button onClick={this.loginPage}>Login</button>
          <br />
          <button onClick={this.regPage}>Register</button>
        </header>
      </div>
    );
  }
}

export default App;
