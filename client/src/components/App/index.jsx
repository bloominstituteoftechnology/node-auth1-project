import React, { Component } from "react";
import "./index.css";

class App extends Component {
  state = {
    username: "",
    password: "",
    hasLoggedIn: false
  };

  inputChangeHandler() {}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the authentication app</h1>
          <button>Login</button>
          <br />
          <button>Register</button>
        </header>
      </div>
    );
  }
}

export default App;
