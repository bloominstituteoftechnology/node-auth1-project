import React, { Component } from "react";
import { Link } from "react-router-dom";

// import axios from "axios";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="SmurfForm">
        {/* "change handle input change to correct submit function" */}
        <form onSubmit={this.handleInputChange}>
          <input
            onChange={this.handleInputChange}
            placeholder="...name"
            value={this.state.username}
            name="username"
          />
          <input
            onChange={this.handleInputChange}
            placeholder="...password"
            value={this.state.password}
            name="password"
          />
          <button type="submit">Register</button>
        </form>
        <Link to={"/"}>Back to Homepage</Link>
      </div>
    );
  }
}
