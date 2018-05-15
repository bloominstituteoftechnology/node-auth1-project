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
      .then(user => {
        this.getUsers()
        this.setState({ validLogin: true, logoutOption: true })
      })
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
          <div className="opacity w-50 mx-auto rounded">
          <div key={index} className="border border-dark m-3 p-3 bg-light rounded" style={{"z-index": 2222}}>
            <div>
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
          </div>
          </div>
        ))}
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="mt-3 d-flex align-center justify-content-center">
          <input 
            className="userInput"
            type="text"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={event => this.setState({ [event.target.name]: event.target.value })}
          />
          <input 
            className="userInput ml-2"
            type="password"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={event => this.setState({ [event.target.name]: event.target.value })}
          />
          {this.state.logoutOption ? (
            <Button className="ml-2" color="dark" onClick={() => this.handleLogout()}>Logout</Button>
          ) : (
            <Button className="ml-2" color="dark" onClick={() => this.handleLoginAttempt()}>Login</Button>
          )}
          <Button className="ml-2" color="dark" onClick={() => this.handleNewUser()}>Register</Button>
        </div>
        <div className="">
          {this.state.validLogin ? (<div style={{color: "white"}} className="mt-3 font-weight-bold">login successful</div>) : null}
          {this.state.logoutSuccess ? (<div style={{color: "white"}} className="mt-3 font-weight-bold">logged out</div>) : null}
          {this.state.validLogin ? this.displayUsers() : null}
        </div>
      </div>
    )
  }
}