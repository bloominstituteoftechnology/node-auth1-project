import React, { Component } from "react";
import LoginForm from "../components/LoginFormComponent";
import http from '../util/http'

class LoginView extends Component {
  state = {
    username: "",
    password: "",
    isLogedIn: false
  };

  inputChange = (event) => {
      console.log(event.target.name)
      this.setState({
          [event.target.name]: event.target.value
      })
  }

  submit = async event => {
      this.setState({
          isLogedIn: await http.login({
              username: this.state.username,
              password: this.state.password
          })
      })
  }

  render() {
    return (
        <div>
            {!this.isLogedIn
                ? <LoginForm inputChange={this.inputChange} submit={this.submit}/>
                : <h1>Logged in..</h1>}
        </div>
    );
  }
}

export default LoginView;
