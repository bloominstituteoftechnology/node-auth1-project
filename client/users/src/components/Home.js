import React, { Component } from 'react';
import '../App.css';
import '../index.css';
import { Link } from 'react-router-dom';
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernames: []
    }
  }

  componentDidMount = () => {
    axios
      .get(`http://localhost:8000/`)
      .then(res => {
        console.log('authorized', res)
      })
      .catch(err => console.log('Unauthorized', err))
  }

  getUsers = () => {
    axios
      .get(`http://localhost:8000/api/users/`)
      .then(res => {
        console.log('res', res)
        this.setState({
          usernames: res.data
        })
      })
      .catch(err => console.log('get error', err))
  }

  handleLogout = id => {
    //const URL = 'http://localhost:3000/'
    axios
      .get(`http://localhost:8000/api/logout`)
      //.then(response => window.location.href = URL)
      .then(response => console.log('logout response', response))
      .catch(error => console.log('logout error', error))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Auth-i</h1>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button type='button' className="btn btn-secondary mr-2" onClick={() => this.getUsers()}>Users</button>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button type='button' className="btn btn-info mr-2">Register</button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button type='button' className="btn btn-success mr-2">Login</button>
          </Link>
          <button type='button' onClick={this.handleLogout} className="btn btn-danger mr-2">Logout</button>
        </header>
        <div className="container">
          <h4>Users:</h4>
          {this.state.usernames.map(user =>
            <div>
              <div key={user.id}>
                <div className="card-body">
                  <h5 className="card-title py-0">{user.username}</h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;