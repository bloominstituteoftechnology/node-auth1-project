import React, { Component } from 'react';
import axios from 'axios';
import '../styles/Users.css';
class UserForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.addUser = this.addUser.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  addUser(event) {
    console.log("ADDING USER", this.state);
    //event.preventDefault();
    var userURL = 'http://localhost:5000/users';
    axios
    .post(userURL, this.state)
    .then(response => {
      console.log(response);
      //this.props.refresh();
      this.setState({ name: '', password: ''});
    })
    .catch((error) => {
      console.log('Could not create the user', error);
    });
  }

  updateUsername(event) {
    this.setState({
      username: event.target.value
    });
  }

  updatePassword(event) {
    this.setState({
      password: event.target.value
    });
  }


  render() {
    return (
      <div className="UserForm">
        <form onSubmit={this.addUser} >
          <input
            onChange={this.updateUsername}
            placeholder="Username"
            value={this.state.username}
          />
          <input
            type="password"
            onChange={this.updatePassword}
            placeholder="Password"
            value={this.state.password}
          />
          <button type="submit">Add User</button>
        </form>
      </div>
    );
  }
}

export default UserForm;
