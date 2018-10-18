import React, { Component } from 'react';
import axios from 'axios';

class Users extends Component {
  state = {
    user:[]
  }
  render() {
    return (
      <div>
        <h2>List of Users</h2>
      </div>
    );
  }

  componentDidMount() {
    const token = localStorage.getItem('jwt');
    const endpoint = 'http://localhost:3300/api/users';
    const options = {
      header:{
        Authorization: token
      }
    }
    axios
      .get(endpoint,options)
      .then(res => {
        console.log(res.data);
        this.setState({users: res.data.users});
      })
      .catch(err => {
        console.error('ERROR', err);
      });
  }
}

export default Users;