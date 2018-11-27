import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios'

class App extends Component {
  state = {
    username: '',
    password: '',
    users: []
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleLogin = e => {
    e.preventDefault()
    const { username, password } = this.state
    axios
      .post('http://localhost:8000/api/login', { username, password })
      .then(res => {
        axios
          .get('http://localhost:8000/api/users')
          .then(res => console.log(res.data))
      })
  }

  handleRegister = e => {
    e.preventDefault()
    const { username, password } = this.state
    axios
      .post('http://localhost:8000/api/register', { username, password })
      .then(res => {
        axios
          .get('http://localhost:8000/api/users')
          .then(res => console.log(res.data))
      })
  }

  render () {
    const { username, password } = this.state
    return (
      <div className='App'>
        <input name='username' onChange={this.handleChange} value={username} />
        <input name='password' onChange={this.handleChange} value={password} />
        <button onClick={this.handleLogin}>Login</button>
        <button onClick={this.handleRegister}>Register</button>
        <div>
          {this.state.users.map(user => <div>{user.username}</div>)}
        </div>
      </div>
    )
  }
}

export default App
