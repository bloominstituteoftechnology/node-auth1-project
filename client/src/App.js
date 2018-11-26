import React, { Component } from 'react';
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loggedIn: false,
        users: [],
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:9001/api/users")
      .then(res => this.setState({...this.state, users: res.data}))
      .catch(err => console.log(err))
  }

  changeHandler = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value})
  }

  

  render() {
    return (
      <div className="App">
          {this.state.users.map(user => {
            return <p key={user.id}>{user.username} - {user.password}</p>
          })}
          <div>
            <h1>Please register and log in</h1>
            <Register loggedIn={this.state.loggedIn} />
            <Login loggedIn={this.state.loggedIn} />
          </div>
      </div>
    );
  }
}

export default App;
