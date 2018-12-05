import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import UserForm from './components/UserForm';
import { Route, NavLink } from 'react-router-dom';

const URL = 'http://localhost:5678';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userAlert: false,
      newUser: {
        username: '',
        password: ''
      }
    }
  }

  componentDidMount() {
    axios
      .get(`${URL}/api/users`)
      .then(response => {
        console.log('response', response)
        this.setState({ 
          users: response.data, 
          userAlert: false 
        })})
      .catch(error => {
        console.error('Error getting users...', error)
      })
  }

  addUser = event => {
    event.preventDefault();
    axios.post('http://localhost:5678/api/register', this.state.newUser)
      .then(res => this.setState({
        users: res.data,
        userAlert: false,
        newUser: {
          username: '',
          password: ''
        }
      }))
      .catch(error => this.smurfAlert(error));
  }

  userAlert = () => {
    this.setState({
      userAlert: true
    })
  }

  userAlertOff = () => {
    this.setState({
      userAlert: false
    })
  }

  handleInputChange = e => {
    this.setState({
      newUser: {
        ...this.state.newUser,
        [e.target.name]: e.target.value
      }
    });
  };

  render() {
    return (
      <div className="App">
        <div className='navbar'>
          <NavLink exact to='/login'>
            <h3>Login</h3>
          </NavLink>
          <NavLink to='/register'>
            <h3>Sign Up</h3>
          </NavLink>
          <NavLink to='/users'>
            <h3>Users</h3>
          </NavLink>
        </div>
        <Route
          path='/register'
          render={props => (
            <UserForm
              {...props}
              newUser={this.state.newUser}
              handleInputChange={this.handleInputChange}
              addUser={this.addUser}
              userAlert={this.state.userAlert}
            />
          )}
        />
      </div>
    );
  }
}

export default App;
