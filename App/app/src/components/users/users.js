import React, { Component } from 'react';
// import './App.css';

class Users extends Component {
  state = {
    users: [],
    
  }

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => this.setState({ users}));
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.users.map(user =>
            <li key={user.id}>{user.username}</li>
            )}
        </ul>
         
      </div>
    );
  }
}

export default Users;
