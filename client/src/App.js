import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.js";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      loggedIn: false,
      credentials: {
        username: "",
        password: ""
      }
    };
  }


  loginHandler = ev => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [ev.target.name]: ev.target.value
      }
    });
  };

  loginEvent = ev => {
    ev.preventDefault();
    if (
      this.state.credentials.username === "" ||
      this.state.credentials.password === ""
    ) {
      return alert("Please enter a username and password.");
    }
    axios
      .post("http://localhost:9000/api/login", this.state.credentials)
      .then(res => {
        console.log(res.data)
      })
  };

  registerEvent = ev => {
    ev.preventDefault();
    if (
      this.state.credentials.username === "" ||
      this.state.credentials.password === ""
    ) {
      return alert("Please enter a username and password.");
    }
    axios
      .post("http://localhost:9000/api/register", this.state.credentials)
      
  };

  getUsers = ev => {
    ev.preventDefault()
      axios.get("http://localhost:9000/api/users").then(res => {
        this.setState({ users: res.data });
      });
  }



  render() {
    return (
      <div className="App">
        <Route
          path="/"
          render={props => (
            <LoginPage
              {...props}
              loginHandler={this.loginHandler}
              loginEvent={this.loginEvent}
              registerEvent={this.registerEvent}
              getUsers={this.getUsers}

            />
          )}
        />
      </div>
    );
  }
}

export default App;
