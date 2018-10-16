import React from "react";
import axios from "axios";
import "./index.css";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loggedIn: false
    };
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleLogin = event => {
    event.preventDefault();
    const registerUser = {
      username: this.state.username,
      password: this.state.password
    };
    console.log(registerUser);
    axios
      .post("http://localhost:8800/api/register", registerUser)
      .then(res => {
        console.log("some data:", res.data);
        if (res.data.welcome !== "") {
          this.setState({ logggedIn: true });
          this.props.history.push("/profile");
        } else {
          this.props.history.push("/register");
        }
      })
      .catch((err, res) => {
        this.props.history.push("/unauthorized");
      });
  };

  render() {
    return (
      <div className="formContainer">
        <h1>Registration Page</h1>
        <div className="formField">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="username..."
            onChange={this.handleChange}
            value={this.state.username}
          />
        </div>
        <div className="formField">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="password..."
            onChange={this.handleChange}
            value={this.state.password}
          />
        </div>
        <div>
          <button onClick={this.handleLogin}>Register</button>
        </div>
      </div>
    );
  }
}

export default Register;
