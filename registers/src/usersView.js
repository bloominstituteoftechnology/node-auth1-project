import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import axios from "axios";

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  fetchingUsers = () => {
    const promise = axios.get("http://localhost:7000/api/registers");
    console.log("promise2", promise);

    promise
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(err => {});
  };
  componentWillMount = () => {
    this.fetchingUsers();
  };

  render() {
    console.log("u", this.state.users);

    return (
      <div>
        hello
        {this.state.users.map(user => {
          return (
            <div>
              <ul>{user.username}</ul>
            </div>
          );
        })}
      </div>
    );
  }
}

export default UsersView;
