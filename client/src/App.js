import React, { Component } from 'react';
import { LoginForm, Form } from './Components'
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

const port = 5000
const proccess = { env: {
  url: ('http://localhost:' + port)
}}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creds: {username: '', password: ''},
      users: [],
      loggedIn: false
    }
  }

  updateCreds = (creds) => {
    this.setState({creds})
  }

  componentDidMount() {
    this.getUsers();
  }
  register = async (creds) => {
    try {
      console.log('register', userId)
      const userId = await axios.post(proccess.env.url + '/api/register', creds)
      await this.setState({ userId })
    } catch(err) {
      console.log(err)
    }
  }
  login = async (creds) => {
    try {
      console.log('login', login)
      const login = await axios.post(proccess.env.url + '/api/login', creds)
      await this.setState({ loggedIn: true })
    } catch(err) {
      console.log(err)
    }
  }
  getUsers = async () => {
    try {
      console.log('getUsers', users)
      const users = await axios.get(proccess.env.url + '/api/users')
      await this.setState({ users })
    } catch(err) {
      console.log(err)
    }
  }  
  logOut = async () => {
    try {
      console.log('getUsers', loggedOut)
      const loggedOut = await axios.post(proccess.env.url + '/api/logout')
      await this.setState({ loggedIn: false })
    } catch(err) {
      console.log(err)
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Form {...{ 
            inputs: { username: '', password: ''},
            onSubmit: this.login,
            formTitle: 'login'
          }} />
          <LoginForm 
            {...{
              creds: this.state.creds,
              handleCreds: this.handleCreds
              }}
            loggedIn={this.state.loggedIn} ></LoginForm>
          <div style={styles.buttons}>
            <button onClick={this.login}>Login</button>
            <button onClick={this.register}>Register</button>
            <button onClick={this.logOut}>Log Out</button>
          </div>
          <button onClick={this.getUsers}>Get Users</button>

        </header>
      </div>
    );
  }
}

const styles = {
  buttons: {
    display: 'flex',
    flexDirection: 'row'
  }
}

export default App;
