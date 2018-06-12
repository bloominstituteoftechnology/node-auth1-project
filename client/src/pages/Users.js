import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Users extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      loading: true,
      loginState: false
    }
  }
  componentDidMount() {

    console.log("Component mounting");
    // axios.get('http://localhost:5000/api/users')
    const reqObj = {
      url: 'http://localhost:5000/api/users',
      method: 'get',
      withCredentials: true
    };
    const instance = axios.create({
      headers: { "Access-Control-Allow-Credentials": true }
    });
    instance(reqObj)
      .then(res => {
        this.setState({ users: res.data, loading: false, loginState: true})
      })
      .catch(error => {
        const code = error.response.status;
        console.log("Error status code:",code);
        if (code === 401) {
          this.setState({loginState: false});
        }
      });
  }

  loginPlease() {
    return (
      <div>
        <h3>You are not logged in.</h3>
        <Link to='/login'>Click here to log-in.</Link>
      </div>
    );
  }

  displayUsers() {
    return (
      <div>
        <h3>List of Users in Ron's Silly App</h3>
        <ul>
          {this.state.users.map(user => <li key={user.username}>{user.username}</li>)}
        </ul>
      </div>
    );
  }

  render() {

    return (
      <div>
        { !this.state.loginState ? this.loginPlease() : this.displayUsers() }
        <Link to='/'>Go back.</Link>
      </div>
    );
  }
}

Users.propTypes = {};

export default Users;
