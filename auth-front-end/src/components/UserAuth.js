import React, { Component } from "react";
import axios from "axios";

class UserAuth extends Component {
  state = {
    user: "",
    password: "",
    errorMsg: null
  };

  handleInput = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
      errorMsg: null
    });
  };

  login = () => {
    axios
      .post("http://localhost:4500/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(res => this.props.history.push("/home"))
      .catch(err => this.setState({ errorMsg: "lol try again nub" }));
  };

  signup = () => {
    axios
      .post("http://localhost:4500/register", {
        username: this.state.username,
        password: this.state.password
      })
      .then()
      .catch();
  };
  render() {
    return (
      <div>
        <h1>I'm a little teapot</h1>
      </div>
    );
  }
}

export default UserAuth;
