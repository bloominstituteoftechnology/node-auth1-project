import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      user: {
        username: '',
        password: '',
        isLoggedIn: false
      }
      
    }
  }

  handleChange = (user, event) => {
    this.setState({[user]: {...this.state[user], [event.target.name]: event.target.value}})
  }

  addUser = () => {
    const user = this.state.user;
    axios.post('http://localhost:8000/api/register', user)
    .then(response => {
      console.log(response);
      this.setState({users: response.data})
    })
    .catch(err => {
      console.log(err)
    })
  }

  logIn = () => {
    const user = this.state.user;
    axios.post('http://localhost:8000/api/login', user)
    .then(response => {
      console.log(response);
      this.setState({isLoggedIn: !this.state.isLoggedIn})
    })
    .catch(err => {
      console.log(err)
    })
  }

  getUsers = () => {
    axios.get('http://localhost:8000/api/restricted/users')
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className="App">
      <h3>Log In</h3>
        <input 
            type='text'
            name='username'
            placeholder='Username'
            onChange={this.handleChange.bind(this, 'user')}
            />
            <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={this.handleChange.bind(this, 'user')}
            />
            <button onClick={this.logIn()}>Log in</button>
            {this.state.user.isLoggedIn ? this.state.users.map(user => {
              return <ul><li>{user.username}</li></ul>
            }) : null}
      <h3>Register</h3>
        <form>
          <input
            type='text'
            name='username'
            placeholder='Choose a username'
            onChange={this.handleChange.bind(this, 'user')}
            />
          <input
            type='password'
            name='password'
            placeholder='Choose a password'
            onChange={this.handleChange.bind(this, 'user')}
            />
            <button onClick={this.addUser}>Register</button>
            </form>
      </div>
    );
  }
}

export default App;
