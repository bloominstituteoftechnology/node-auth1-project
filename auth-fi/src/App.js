import React, { Component } from 'react';
import './App.css';
import SignIn from './components/SignIn';
import LoggedIn from './components/LoggedIn';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false
    }
  }

  loginHandler = (loginBool) =>{
    if(loginBool === 'Logged In'){
      this.setState({
        isSignedIn: true,
      })
    }
  }

  

  render() {
    if(this.state.isSignedIn){
      return (
        <LoggedIn/>        
      );
    }
    else{
     return (
     <div className="App">
          <div className="App">
            <SignIn loginHandler={this.loginHandler}/>        
          </div>   
      </div>)
    }
    
  }
}

export default App;
