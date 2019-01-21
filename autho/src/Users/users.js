import React, { Component } from "react";

import User from "./user";
import { UserCard } from "../Styles/styles";

class Users extends Component {
  render() {

    return (
      <UserCard>
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
      </UserCard>
    );
  }
}

export default Users;
