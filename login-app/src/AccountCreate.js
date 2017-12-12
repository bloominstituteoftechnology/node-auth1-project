import React, { Component } from 'react';
import axios from 'axios';

class AccountCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      requestError: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }
  saveUser(e) {
    e.preventDefault();
    const { username, password } = this.state;
    console.log({ username, password });
    axios
      .post('http://localhost:3000/users', { username, password })
      .then(response => {
        console.log(response);
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
        <h2>Create Account</h2>
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
        <button onClick={this.saveUser}>Create User</button>
        <p
          onClick={() => {
            this.props.toggleLogin('createAccount');
          }}
        >
          Already Have an account?
        </p>
      </form>
    );
  }
}

export default AccountCreate;
