import React, { Component } from 'react';
import axios from 'axios';
import User from './components/User';
import { Input } from 'reactstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      username: "",
      password: "",
      display: true,
      disabled: true,
      userList: [],
      userInfo: []
    })
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // ********* USER LOGIN **************************
  login = (e) => {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      let userInfo =
      {
        username: this.state.username,
        password: this.state.password
      };
      axios
        .post('http://localhost:3300/api/login', userInfo)
        .then(response => {
          alert('Login successful...')
          let passWord = "";
          let userName = "";
          this.setState(() => ({ username: userName, password: passWord, display: false, disabled: false }))
        })
        .catch(error => {
          console.error('Server Error', error);
        });
    } else {
      alert('Please enter a username and password')
    }
  }

  // ************ USER REGISTER ***************************
  register = (e) => {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      let userInfo =
      {
        username: this.state.username,
        password: this.state.password
      };
      axios
        .post('http://localhost:3300/api/register', userInfo)
        .then(response => {
          alert('registration complete...')
          let passWord = "";
          let userName = "";
          this.setState(() => ({ username: userName, password: passWord }))
        })
        .catch(error => {
          console.error('Server Error', error);
        });
    } else {
      alert('Please enter a username and password')
    }
  }

  // ************ GET USER LIST *******************
  userList = (e) => {
    e.preventDefault();
    axios
      .get('http://localhost:3300/api/users/')
      .then(response => {
        let tmpArray = [];
        for (let x = 0; x < response.data.length; x++) {
          tmpArray.push(response.data[x].username)
        }
        this.setState(() => ({ userList: tmpArray }));
      })
      .catch(error => {
        console.error('Server Error', error);
      });
  }

  // ***************** USER LOGOUT **************************
  logout = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3300/api/logout')
      .then(response => {
        alert('logout successful')
        this.setState(() => ({ userList: [], display: true, disabled: true }));
      })
      .catch(error => {
        console.error('Server Error', error);
      });
  }

  // **** USER MESSAGE JUST SOME HUMOR *****
  message = () => {
    alert("Sorry, we dont know it either... #BestSecurityEver");
  }

  render() {
     // *** CODE TO CHANGE THE LOGOUT AND USERLIST BUTTONS TEXT COLOR ****
     let classNames = require('classnames');

    let btnClass = classNames({
      btnLogout: true,
      'btnNoWork': this.state.display
    }) 
    return (
      <div className="App">
        <header className="main-header">
          <div className="title">Auth-i Application
          </div>
        </header>
        <div className="container-1">
          <div className="text"><p>Click Login. If you are new please click the register button</p>
            <p>first then Login. To view the list of users, select the User List button.</p> </div>
          <form className="main-form">
            <Input type="text" id="username" value={this.state.username} name='username' className="form-control" placeholder="Enter Username" onChange={this.handleInputChange} />
            <Input type="text" id="password" value={this.state.password} name='password' className="form-control" placeholder="Enter Password" onChange={this.handleInputChange} />

            <button className="btn-register" value="register" onClick={this.register} name="viewHome">Register</button>
            <button className="btn-login" value="login" onClick={this.login} name="viewHome">Login</button>
            <button className={btnClass} disabled={this.state.disabled} value="user-list" onClick={this.userList} name="viewHome">User List</button>
            <button className={btnClass} disabled={this.state.disabled} value="logout" onClick={this.logout} name="viewHome">Logout</button>

          </form>
          <div className="message" onClick={this.message}><p>Click Here if you forgot your password.</p> </div>
          <div className="user-list">New User List:{this.state.userList.map((user, index) => {
            return <User user={user} key={index} />;
          })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
