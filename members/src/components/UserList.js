import React, { Component } from 'react';
import axios from 'axios';

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
    }
  };

  componentDidMount() {
    this.fetchUsers();
  }


  fetchUsers = variableName => {
    axios
      .get(`http://localhost:5000/api/users`)
      .then(response => {
        this.setState(() => ({ users: response.data }));
      })
      .catch(response => {
        console.log(response);
      })
  }

  render() {
    if (!this.state.users) {
      return <div>{this.state.auth}</div>;
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