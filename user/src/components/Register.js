import React, { Component } from "react";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  helper = e => {
    this.props.addUser(e, this.state);
    this.setState({ username: "", password: "" });
  };

  render() {
    // console.log(this.props.addUser);
    return (
      <div>
        <div>
          <h3>create new user</h3>
        </div>
        <form onSubmit={this.helper}>
          <input
            name="username"
            value={this.state.username}
            onChange={this.changeHandler}
            type="text"
            placeholder="username"
          />
          <input
            name="password"
            value={this.state.password}
            onChange={this.changeHandler}
            type="password"
            placeholder="password"
          />
          <button>Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
