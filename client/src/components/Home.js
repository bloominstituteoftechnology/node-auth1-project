import React from 'react';
import {Link, Redirect} from 'react-router-dom'; 
import axios from 'axios'; 
const fakeAuth = {
  isAuthenticated: false, 
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) //async
  },
  signout(cb){
    this.isAuthenticated = false 
    setTimeout(cb, 100)
  }
}
class Home extends React.Component{
  state = {
    username : null
  }
  render(){
    if (this.state.username){
      return (
        <div>Home Testing</div>
      )  
    } else {
      return (
        <div>
          <label>Username:</label>
          <input type="text" placeholder="Enter Username:"/>
          <br/>
          <label>Password :</label>
          <input type="text" placeholder="Enter Password:"/>
          <br/>
          <Link to="/register">Register</Link>
        </div>
      )
       
    }
    
  }
}

export default Home; 