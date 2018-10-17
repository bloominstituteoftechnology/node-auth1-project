import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  state = {
    username: "doris",
    password: "12345678",
    error: null,
    registering: false
  };
  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleRegister = () => {
    this.setState({registering: true});
    axios
      .post("http://localhost:9000/api/register", {
        username: this.state.username,
        password: this.state.password
      })
      .then(resp => {
        console.log(resp);
        this.setState({
          username: resp.data.username,
          password: resp.data.password,
          registering: false
        });
        this.props.history.push("/login");
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: err, registering: false });
      });
  };
  render() {
    return this.state.registering ? (
      <h2>
        Registering your account... hold tight, this will take a few seconds.
      </h2>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
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
