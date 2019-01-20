import React, { Component } from 'react';
import axios from 'axios';
//import styled from 'styled-components';
import User from './components/User';
import { Input } from 'reactstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      username: "",
      password: "",
      userList: [],
      userInfo: []
    })
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log('the state', this.state);
  };

  login = (e) => {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      let userInfo = 
        { 
          username: this.state.username,
        password: this.state.password
        };
   console.log('userInfo', userInfo);
      axios
      .post('http://localhost:3300/api/login', userInfo)
      .then(response => {
        alert('Login successful...')
        let passWord = "";
        let userName = "";
        this.setState(() => ({username: userName, password: passWord})) 
        //  this.setState(() => ({ TripTbl: newTripRec }));
      })
      .catch(error => {
        console.error('Server Error', error);
      });
    } else {
      alert('Please enter a username and password')
    }
  }

  register = (e) => {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      let userInfo = 
        { 
          username: this.state.username,
        password: this.state.password
        };
    
      console.log('userInfo', userInfo);
      axios
        .post('http://localhost:3300/api/register', userInfo)
        .then(response => {
alert('registration complete...')
        let passWord = "";
        let userName = "";
        this.setState(() => ({username: userName, password: passWord})) 

//  this.setState(() => ({ TripTbl: newTripRec }));
        })
        .catch(error => {
          console.error('Server Error', error);
        });
    } else {
      alert('Please enter a username and password')
    }
  }

  userList = (e) => {
    e.preventDefault();
    axios
      .get('http://localhost:3300/api/users/')
      .then(response => {
console.log("response.data:", response.data);
let tmpArray = [];

for (let x = 0; x < response.data.length; x++) {
tmpArray.push(response.data[x].username)
}
//const test = response.data[0].username;
console.log("tmpArray:", tmpArray);
//localStorage.setItem('test1', test);

this.setState(() => ({ userList: tmpArray }));
      })
      .catch(error => {
        console.error('Server Error', error);
      });

  }

  logout = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3300/api/logout')
      .then(response => {
alert('logout successful')
        this.setState(() => ({ userList: [] }));
      })
      .catch(error => {
        console.error('Server Error', error);
      });
  }


  render() {
let newUserList =  localStorage.getItem('test1')



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
            <button className="btn-get-user-list" value="user-list" onClick={this.userList} name="viewHome">User List</button>
            <button className="btn-logout" value="logout" onClick={this.logout} name="viewHome">Logout</button>

          </form>
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
