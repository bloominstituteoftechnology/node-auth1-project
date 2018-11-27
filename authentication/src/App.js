import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios"

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  registerUser = e => {
    axios.post('http://localhost:8000/api/register', {
      username: this.state.username,
      password: this.state.password
    }).then(res => console.log(res)).catch(err => console.log(err))
  }
  render() {
    return (
      <div className="App">
       <input 
       type="text"
       name="username"
       value={this.state.username}
       onChange={this.handleChange}
       />
          <input 
       type="text"
       name="password"
       value={this.state.password}
       onChange={this.handleChange}
       />
       <button onClick={this.registerUser}>Register</button>
      </div>
    );
  }
}

export default App;
