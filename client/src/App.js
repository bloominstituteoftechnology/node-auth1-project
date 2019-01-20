import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      data: [],
    }
  }

  componentDidMount(){
    axios 
      .get(`http://localhost:3000/api/users`)
      .then(response => {
        this.setState({data: response.data })
      })
      .catch(err => {
      console.log("Fail to GET data from server", err)
      })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">    
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <div>
          BODY
          {this.state.data.map(e => {
              return (
                <p>{e.username}</p>
              )
          })}
        </div>
      </div>
    );
  }
}

export default App;
