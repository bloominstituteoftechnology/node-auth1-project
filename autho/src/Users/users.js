import React, { Component } from "react";

import User from "./user";

class Users extends Component {
  render() {
    console.log(this.props.users);
    return (
      <div className="Users">
        <h1>Users currently</h1>
        <ul>
          {this.props.users.map(user => {
            return (
              <User
                user={user.username}
                id={user.id}
                key={user.id + user.username}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Users;
