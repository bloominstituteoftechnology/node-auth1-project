import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from 'axios'

class HomeContainer extends Component {
  state = {
    isLoggedIn: false,
    username: '',
    password: ''
  };
handleInput = event => {
    const {name,value} = event.target;
    this.setState({
        [name]:value,
    })
}

registerUser = () => {
    const {username, password} = this.state
    axios.post('http://localhost:7777/api/register', {username, password})
    .then(() => {
        alert('registered')
    }).catch(err => alert(err))
}

loginUser = () => {
  const {username, password} = this.state
  axios.post('http://localhost:7777/api/login', {username, password})
  .then(response => {
      response.data.loggedIn ? alert('logged in'): alert('not logged in')
  }).catch(err => alert(err))
}

  render() {
    if (this.state.isLoggedIn) this.props.history.push("/user");
    return (
      <div>
        <h1 onClick={() => this.props.history.push("/")}>User Page</h1>
        <div>
          <button onClick={() => this.props.history.push("/register")}>Register</button>
          <button onClick={() => this.props.history.push("/login")}>
            Login
          </button>
        </div>
        <Route
          path="/register"
          render={props => {
            return (
              <div>
                <div>
                  <h2>Register</h2>
                  <input name="username" onChange={this.handleInput} value = {this.state.username}/>
                  <input name="password" onChange={this.handleInput} value = {this.state.password}/>
                  <button onClick={this.registerUser}>Sumbit</button>
                </div>
              </div>
            );
          }}
        />
        <Route
          path="/login"
          render={props => {
            return (
              <div>
                <div>
                  <h2>Login</h2>
                  <input name="username" onChange={this.handleInput} value = {this.state.username}/>
                  <input name="password" onChange={this.handleInput} value = {this.state.password}/>
                  <button onClick={this.loginUser} >Sumbit</button>
                </div>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default HomeContainer;
