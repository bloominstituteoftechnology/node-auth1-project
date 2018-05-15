import React from "react";
import axios from "axios";

class Users extends React.Component {
  state = {
    users: []
  };

  getUsers = () => {
    axios.get("http://localhost:5000/api/users").then(response => {
      console.log(response).catch(err => {
        console.log(err);
      });
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.getUsers()}>Get Users </button>
        {this.state.users.map(user => {
          return user.username;
        })}
      </div>
    );
  }
}

export default Users;
