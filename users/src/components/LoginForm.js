import React, { Component } from "react";
import axios from "axios";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: ""
    };
  }

  register = event => {
    event.preventDefault();
    const user = {
      username: this.state.name,
      password: this.state.password
    };
    axios.post("http://localhost:5000/api/login", user).then(response => {
      axios
        .get("http://localhost:5000/api/users")
        .then(response => {
          console.log(response).catch(err => {
            console.log(err);
          });
        })
        .catch(err => {
          console.log(err);
        });
    });

    this.setState({
      name: "",
      password: ""
    });
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="App">
        <h2>Log in: </h2>
        <form className="form">
          <input
            onChange={this.handleInputChange}
            placeholder="name"
            value={this.state.name}
            name="name"
          />
          <input
            onChange={this.handleInputChange}
            placeholder="password"
            value={this.state.password}
            name="password"
          />
          <button
            className="submitButton"
            type="submit"
            onClick={this.register}
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
