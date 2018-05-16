import React, { Component } from 'react';
import axios from 'axios';

export default class UserList extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      err: null,
    }
  };

  componentDidMount() {
    this.fetchUsers();
  }


  fetchUsers = () => {
    axios
      .get(`http://localhost:5000/api/users`)
      .then(res => {
        return res.json();
      })
      .then(response => {
        this.setState(() => ({ users: response.data }));
      })
      .catch(err => {
        console.log(err);
        this.setState(() => (err.error));
      })
  }

  render() {
    if (!this.state.users) {
      console.log(this.state);
      return <div>{this.state.err}</div>;
    }

    const users = this.state.users;
    return (
      <div>
        <h1>USER LIST</h1>
        {users.map(user => (
          <div className="user-card">
            <h3>{users.username}</h3>
            <p>{users.password}</p>
            ))}
          </div>
        ))};
      </div>
    );
  }
};