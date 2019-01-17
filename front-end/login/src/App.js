import './App.css';
import axios from 'axios'
import React, { Component } from 'react'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }
  onChangeHandler = e => {
    const username = e.target.username;
    const password = e.target.password;
    this.setState({
      username: username,
      password: password
    })
  }
  addUserHandler = e => {
    e.preventDefault();
    axios.post('http://localhost:3300/api/register', {
      username: this.state.username,
      password: this.state.password
    })
    .then(response => {
      console.log(response)
    })
    .catch(err => console.log(err))
  }
  render() {
    return (
      <div>
      <h1>Register</h1>
      <form onSubmit = {this.addUserHandler}>
      <input onChange={this.onChangeHandler} placeholder='username' value={this.state.username}/>
      <input onChange={this.onChangeHandler} placeholder='password' value={this.state.password} />
      <button>Submit</button>
      </form>
      </div>
    )
  }
}


