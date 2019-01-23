import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: ""
    };
  }
  changeHandler = e => {
    return this.setState({
      [e.target.name]: e.target.value
    });
  };
  onSubmit = e => {
    e.preventDefault();
    const clientUser = {
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post("http://localhost:3300/api/login", {
        clientUser,
        withCredentials: true
      })
      .then(res => {
        if (res.data.message === "Logged in") {
          console.log(res.data);
        }
      })
      .catch(err => console.log({ err }));
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.changeHandler}
          placeholder="username"
        />
        <input
          type="text"
          name="password"
          value={this.state.password}
          onChange={this.changeHandler}
          placeholder="password"
        />
        <button type="submit">submit</button>
      </form>
    );
  }
}

export default Login;
