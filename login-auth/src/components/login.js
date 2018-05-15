import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';

export class Login extends Component {
  state = {
    username: "",
    password: "",
    validLogin: false,
    logoutSuccess: false,
    logoutOption: false,
    users: []
  }

  handleLoginAttempt = () => {
    const { username, password } = this.state;
    axios
      .post("http://localhost:5000/login", { username, password })
      .then(user => this.setState({ validLogin: true, logoutOption: true }))
      .catch(err => this.setState({ validLogin: false }));
    this.setState({ username: "", password: "" });
  }

  handleLogout = () => {
    axios
      .get("http://localhost:5000/logout")
      .then(logout => this.setState({ logoutOption: false, logoutSuccess: true, validLogin: false }))
      .catch(err => console.log("error logging out"))
  }

  handleNewUser = () => {
    const { username, password } = this.state;
    axios
      .post("http://localhost:5000/register", { username, password })
      .then(user => console.log("successfully created new user"))
      .catch(err => console.log("error creating new user"))
    this.setState({ username: "", password: "" })
  }

  getUsers = () => {
    axios
      .get("http://localhost:5000/users")
      .then(users => this.setState({ users: users.data }))
      .catch(err => console.log("error fetching users"))
  }

  displayUsers = () => {
    return (
      <div>
        {this.state.users.map((user, index) => (
          <div key={index} className="border border-dark m-3 p-3">
            <div>
              <h5>username:</h5>
              <p>{user.username}</p>
            </div>
            <div>
              <h5>password hash:</h5>
              <p>{user.password}</p>
            </div>
            <div>
              <h5>user id:</h5>
              <p>{user._id}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  render() {
    return (
      <div>
        <input 
          type="text"
          name="username"
          placeholder="username"
          value={this.state.username}
          onChange={event => this.setState({ [event.target.name]: event.target.value })}
        />
        <input 
          type="text"
          name="password"
          placeholder="password"
          value={this.state.password}
          onChange={event => this.setState({ [event.target.name]: event.target.value })}
        />
        {this.state.logoutOption ? (
          <Button onClick={() => this.handleLogout()}>Logout</Button>
        ) : (
          <Button onClick={() => this.handleLoginAttempt()}>Login</Button>
        )}
        <Button onClick={() => this.handleNewUser()}>Register</Button>
        {this.state.validLogin ? (<div>login successful</div>) : null}
        {this.state.logoutSuccess ? (<div>logged out</div>) : null}
        {this.state.validLogin ? (
          <div>
            {this.getUsers()}
            {this.displayUsers()}
          </div>
        ) : null}
      </div>
    )
  }
}