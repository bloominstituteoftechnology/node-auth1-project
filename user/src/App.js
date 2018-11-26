import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Users from "./components/Users";
import Register from "./components/Register";

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }
  componentDidMount() {
    axios
      .get("http://localhost:4500/api/users")
      .then(res => this.setState({ users: res.data }))
      .catch(err => console.log(err));
  }

  addUser = (e, newUser) => {
    console.log("add user fired");
    e.preventDefault();
    axios
      .post("http://localhost:4500/api/register", newUser)
      .then(() => {
        this.setState({ users: [newUser, ...this.state.users] });
      })
      .catch(err => console.log(err));
  };

  render() {
    console.log(this.state.users);
    return (
      <div>
        <Users users={this.state.users} />
        <Register addUser={this.addUser} />
      </div>
    );
  }
}

export default App;
