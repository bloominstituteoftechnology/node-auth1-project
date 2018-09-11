import React from 'react';
import Redirect from 'react-router-dom'; 

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
        <div>Check it out</div>
      )
       
    }
    
  }
}

export default Home; 