import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      password: ""
    };
  }
  add = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  submitLogin = event => {
    event.preventDefault();
    const loginUser = { user: this.state.user, password: this.state.password };
    if (this.state.user === "" || this.state.password === "") {
      alert("Please enter a username and password!");
      return;
    }
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8000/api/login", loginUser)
      .then(response => {
        console.log("response is: ", response);
        this.props.history.push("/Users");
      })
      .catch(err => {
        if (err) {
          alert(`Invalid Login Credentials!`);
        }
      });
  };
  render() {
    return (
      <form className="login-page">
        <div className="login-card">
          <h2>Users App</h2>
          <input name="user" type="text" onChange={this.add} placeholder="user" />
          <input name="password" type="password" onChange={this.add} placeholder="password" />
          <button onClick={this.submitLogin}>Log in</button>
          <Link to="/register">
            <button> Register</button>
          </Link>
        </div>
      </form>
    );
  }
}

export default LoginPage;
