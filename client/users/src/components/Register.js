import React, { Component } from 'react'
import '../index.css';
import '../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
    }
  }

  handleSubmit = () => {
    const URL = 'http://localhost:3000/'
    axios
      .post(`http://localhost:8000/api/register`, {
        username: this.state.user,
        password: this.state.password
      })
      //.then(response => console.log(response))
      .then(response => window.location.href = URL)
      .catch(error => console.log(error));
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleLogout = () => {
    const URL = 'http://localhost:3000/'
    axios
      .get(`http://localhost:8000/api/logout`)
      //.then(response => window.location.href = URL)
      .then(response => console.log('logout response', response))
      .catch(error => console.log('logout error', error))
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
      <h1 className="App-title">Auth-i</h1>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button type='button' className="btn btn-secondary mr-2">Users</button>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button type='button' className="btn btn-info mr-2">Register</button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button type='button' className="btn btn-success mr-2">Login</button>
        </Link>
        <button type='button' onClick={this.handleLogout} className="btn btn-danger mr-2">Logout</button>
      </header>
      <div className="form-group container w-50">
        <h3 className="header mt-2">Register</h3>
        <input
          name='user'
          type='text' 
          className="form-control"
          placeholder="Username"
          onChange={(e) => this.handleChange(e)}
        /><br />
        <input
          name='password' 
          type='password'
          className="form-control"
          placeholder="password"
          onChange={(e) => this.handleChange(e)}
        /><br />
        <button 
          type="submit" 
          className="btn btn-info"
          onClick={() => this.handleSubmit()}
        >
          Save
        </button>
      </div>
      </div>
    )
  }
}