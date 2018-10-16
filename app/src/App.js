import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  state = {
    username: "doris",
    password: "12345678",
    error: null
  };
  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleRegister = () => {
    axios
      .post("http://localhost:9000/api/register", {
        username: this.state.username,
        password: this.state.password
      })
      .then(resp => {
        this.setState({
          username: resp.data.username,
          password: resp.data.password
        });
        console.log(resp);
      })
      .catch(err => {
        this.setState({ error: err });
        console.log(err);
      });
  };
  render() {
    return (
      <div className="App">
        <h1>Please Register</h1> <br />
        <input
          onChange={this.handleOnChange}
          type="text"
          placeholder="username"
          name="username"
          defaultValue="doris"
        />{" "}
        <br />
        <input
          onChange={this.handleOnChange}
          type="password"
          placeholder="Password"
          name="password"
          defaultValue="12345678"
        />{" "}
        <br />
        <button onClick={this.handleRegister} type="submit">
          Register
        </button>
      </div>
    );
  }
}

export default App;
