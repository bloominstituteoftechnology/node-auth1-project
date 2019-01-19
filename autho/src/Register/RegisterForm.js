import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { FormGroup } from "../Styles/styles";

class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        };
    }
    handleInputChange = e => {
      this.setState({ [e.target.name]: e.target.value });
    };
    handleRegister = event => {
    event.preventDefault();
      const addUser = {
        username: this.state.username,
        password: this.state.password
      };
      this.props.register(addUser);
      this.props.history.push('/login')
    };

  render() {
    return (
      <div>
        <FormGroup>
          <h4>Please Register</h4>
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
            onClick={this.handleRegister}
          >
            Register
          </Button>
        </FormGroup>
      </div>
    );
  }
}
export default RegisterForm;
