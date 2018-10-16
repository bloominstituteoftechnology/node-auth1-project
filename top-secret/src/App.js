import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      level_of_security: null,
      loggedIn: false
    }
  }

  handleInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  enter = event => {
    event.preventDefault();
    axios.post('http://localhost:9000/api/login', this.state)
      .then(res => {
        // axios.get('http://localhost:9000/api/restricted').then(res => {console.log(res)}).catch(err=>console.log(err));
        if(res.status === 200) {
          this.setState({loggedIn: true})
        }
      })
      .catch(err => console.log(err));
  }
  
  render() {
    return (
      <div className="App">
        <form action="">
          <input type="text" name="username" placeholder="username" onChange={this.handleInput}/>
          <input type="text" name="password" placeholder="password" onChange={this.handleInput}/>
          <input type="submit" value="enter" onClick={this.enter}/>
        </form>
        {/* {this.state.loggedIn ? (

        ) : (

        )} */}
      </div>
    );
  }
}

export default App;
