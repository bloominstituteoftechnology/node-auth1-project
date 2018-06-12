import React from 'react';
import { Redirect } from 'react-router'
const axios = require('axios')


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: [],
      username: '',
      password: ''
      
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    let login = {
      username: this.state.username,
      password: this.state.password,
    }
    this.setState({
      register: login
    })
  }

  handleSubmit = event => {
      let register = this.state.register
      axios.post(`http://localhost:8000/api/login`, register )
      .then(response => {        
          this.setState({
          register: [],
           username: '',
           password: ''
        })
        if (response) {
          <Redirect to="/home" />
        } 

      })
      .catch(error => {
        this.setState({
          username: '',
          password: ''
        })
      })
  }

  render() {
    return (
    <div>
        Please Log in
     <form onSubmit={this.handleSubmit}>
       <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          value={this.state.username} />
        <input 
          type="text"
          name="password"
          id="password"
          placeholder="Password"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          value={this.state.password} />
        </form>
        <button onClick={this.handleSubmit}> Register </button>
      </div>
    );
  }
}
