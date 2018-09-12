import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

  class Login extends Component {
    constructor() {
      super();
      this.state = {
        username: "",
        password: ""
      }
    }

    componentDidMount() {
        axios.get("http://localhost:3000/logout")
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.error("Server Error", error);
        });
    }

handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

login = () => {
    axios
    .post("http://localhost:3000/login", {
        "username": `${this.state.username}`,
        "password": `${this.state.password}`
    })
    .then(res => {
      console.log("it's a workin");
    })
    .catch(error => {
      console.error("Server Error", error);
    });
    this.setState({
        username: '',
        password: ''
      });
}

    render() {
      return (
        <div>
            <form>
        <input onChange={this.handleInputChange} name="username" placeholder="username"/>
        <input onChange={this.handleInputChange} name="password" placeholder="password"/>
        <Link to="/users"><button onClick={this.login}/></Link>
        </form>
      </div>
      );
    }
  }

  export default Login;