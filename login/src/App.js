import React, { Component } from 'react';
import './App.css';
import { Route, NavLink } from 'react-router-dom';
import Register from './components/register';
import Home from './components/home';
import Login from './components/login';
import Users from './components/users';
import axios from 'axios';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      users: [],
      success: false,
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3800/api/users')
      .then(response => {
        if(typeof response.data.message === 'string'){
          Promise.reject("Error: users are missing!")
        }
        this.setState({ users: response.data })
      })
      .catch(err => console.log(err))
  }

  registerUser = (obj) => {
    axios.post('http://localhost:3800/api/register', obj)
      .then(response => {
        this.setState({
          success: true
        })
      })
      .catch( err => console.log(err))
  }


  loginUser = (obj) => {
    axios.post('http://localhost:3800/api/login', obj)
      .then(response => {
        this.setState({
          loggedIn: true
        })
      })
      .catch( err => console.log(err))
  }

  render() {
    console.log(this.state.users);
    return (
      <div className="App">
        <nav className="navBar">
          <NavLink to="/" exact={true} className="navlink" activeClassName="current" >Home</NavLink>
          <NavLink to="/register" className="navlink" activeClassName="current">Register</NavLink>
          <NavLink to="/login" className="navlink" activeClassName="current">Login</NavLink>
          <NavLink to='/users' className="navlink" activeClassName="current">Users</NavLink>
        </nav>

        <Route path="/register" render={ props => <Register {...props} register={this.registerUser} />} />
        <Route exact path="/" component={Home} />
        <Route path="/login" render={props => <Login {...props} login={this.loginUser} /> } />
        <Route path="/users" render={props => <Users {...props} users={this.state.users}/>}/>

      </div>
    );
  }
}

export default App;
