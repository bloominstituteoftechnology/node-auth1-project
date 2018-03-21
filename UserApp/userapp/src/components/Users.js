import React, { Component } from 'react';
import axios from 'axios';

import User from './User';

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    }
  }

  loadUsers() {
    console.log("Loading Users");
    var userURL = 'http://localhost:5000/';
    axios.get(userURL).then((response)=>{
      console.log("Response from server", response.data) 
      this.setState({users: response.data}); 
    })
    .catch((error)=>{
        console.log("Error is: ", error);
    });
  }

  componentDidMount() {
    this.loadUsers();
  }

  render() {
    return (
      <div className="Users">
        <h1>User List</h1>
        <div className="user__holder">
          <ul className="user__list">
            {
              this.state.users.map((user) => {
                return <User username={user.username} />;
              }
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default Users;
