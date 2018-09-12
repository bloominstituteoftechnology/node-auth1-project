import React, { Component } from 'react';
import axios from 'axios';

  class Login extends Component {
    constructor() {
      super();
      this.state = {
        users: []
      }
    }
    componentDidMount() {
        axios
        .get("http://localhost:3000/users")
        .then(res => {
          this.setState({users: res.data});
        })
        .catch(error => {
          console.error("Server Error", error);
        });
      }

    render() {
      return (
        <div>
      {this.state.users.map(user => <div>{user}</div>)}
    </div>
      );
    }
  }

  export default Login;