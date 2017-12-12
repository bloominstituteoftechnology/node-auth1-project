import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      requestError: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }
  loginUser(e) {
    e.preventDefault();
    const { username, password } = this.state;
    axios
      .post('http://localhost:3000/log-in', { username, password })
      .then(response => {
        console.log(response);
      })
      .then(res => {
        this.props.showMe();
      })
      .catch(err => {
        this.setState({ requestError: true });
        setTimeout(() => {
          this.setState({ requestError: false });
        }, 3000);
      });
  }
  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { username, password } = this.state;
    return (
      <form>
        <h2>User Login</h2>
        {this.state.requestError ? <h4>Error Creating Account</h4> : null}
        <input
          onChange={this.handleInputChange}
          type="text"
          name="username"
          value={username}
        />
        <input
          onChange={this.handleInputChange}
          type="password"
          name="password"
          value={password}
        />
        <button onClick={this.loginUser}>Login</button>
        <p
          onClick={() => {
            this.props.toggleLogin('login');
          }}
        >
          Need an account? Create one!
        </p>
      </form>
    );
  }
}

export default Login;
