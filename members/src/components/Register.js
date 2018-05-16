import React, { Component } from 'react';
import axios from 'axios';
// import axios from 'axios';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
      user: [{
        'username': '',
        'password': '',
      }]
    }
  };

  handleNewUser = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmitNewUser = () => {
    const { user } = this.state;
    user.push(this.state.newUser);
    this.setState({ user, newUser: "" })

    axios
      .post(`http://localhost:5000/api/register`, this.state.user)
        .then(user => user.status(201).send(user))
        .catch(err => console.log(err));
  }

  render() {
    console.log('state ', this.state);
    return (
      <div>
        <h1>REGISTER</h1>
        <input 
          type="text"
          name="username"
          value={this.state.newUser}
          placeholder="username"
          onChange={this.handleNewUser}
        />
        <input
          type="text"
          name="password"
          value={this.state.newUser}
          placeholder="password"
          onChange={this.handleNewUser}
        />
        <button onClick={this.handleSubmitNewUser}>Submit</button>
      </div>
    )
  }
}