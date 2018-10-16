import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    //login
    const user = {
      username: "alejandrok",
      password: "password"
    };
    axios
      .post("http://localhost:9000/api/login", user)
      .then(result => {
        axios
          .get("http://localhost:9000/api/users")
          .then(users => console.log(users))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  handleSubmit() {
    axios
      .post("http://localhost:9000/api/users")
      .then(users => console.log(users))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="App">
        <div className="login-form">
          <form>
            <input type="text" placeholder="username" />
            <input type="password" placeholder="username" />
            <button onSubmit={this.handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
