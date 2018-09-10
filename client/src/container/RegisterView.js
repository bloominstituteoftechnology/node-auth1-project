import React, { Component } from "react";
import RegiterForm from "../components/RegisterComponent";
import http from "../util/http";

class RegisterView extends Component {
  state = {
    username: "",
    password: "",
    isRegistered: false
  };

  inputChange = event => {
    console.log(event.target.name);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submit = async event => {
    this.setState({
      isRegistered: await http.register({
        username: this.state.username,
        password: this.state.password
      })
    });
  };

  render() {
    return (
      <div>
        {!this.isRegistered ? (
          <RegiterForm inputChange={this.inputChange} submit={this.submit} />
        ) : (
          <h1>Sign up completed</h1>
        )}
      </div>
    );
  }
}

export default RegisterView;
