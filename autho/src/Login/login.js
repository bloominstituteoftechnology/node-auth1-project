import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { FormGroup } from "../Styles/styles";


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      login: false
    };
  }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };
    handleLogin = event => {
        event.preventDefault();
        const signIn = {
            username: this.state.username,
          password: this.state.password,
          login: true
        };
        this.props.login(signIn);
        this.props.history.push('/users')
    };


  render() {
    return (
      <div>
        <FormGroup>
                <h4>Please Login</h4>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <Button
            onClick={this.handleLogin}
          >
            Login
          </Button>

        </FormGroup>

      </div>
    );
  }
}

export default Login;
