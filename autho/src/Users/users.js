import React, { Component } from "react";
import axios from "axios";
import User from './user'
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      users: [],
      success: false
    };
  }

  componentDidMount = () => {
    axios
      .get("http://localhost:4300/api/users")
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <div>
        <ul>
          {this.state.users.map(user => {
           return( <User user={user.username} id={user.id} />)
          })}
        </ul>
      </div>
    );
  }
}

export default Users;
