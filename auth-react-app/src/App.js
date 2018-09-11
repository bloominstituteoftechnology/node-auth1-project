import React, { Component, Fragment } from "react";
import HomePage from "./components/homepage/HomePage.js";

import axios from "axios";

import "./App.css";

// users api url
const usersURL = "http://localhost:7000/api/users";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loaded: false,
    };
  }

  // handleLoginChange = event => {
  //   this.setState({
  //     username: event.target.value,
  //   });
  // };

  // handleLogin = () => {
  //   localStorage.setItem("username", this.state.username);
  // };

  // componentDidMount() {
  //   axios
  //     .get(usersURL)
  //     .then(users => {
  //       this.setState({ users: users.data, loaded: true });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  render() {
    if (this.state.loaded) {
      return (
        <Fragment>
          <HomePage />
        </Fragment>
      );
    } else {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }
  }
}

export default App;
