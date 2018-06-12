import React, { Component } from 'react';
import axios from 'axios';

export default class LoggedIn extends Component {
  constructor(props){
    super(props)
    this.state = {
      users: []
    }
  }

  // componentDidMount(){
  //   axios
  //     .get('http://localhost:8000/api/users')
  //       .then(response => {
  //         this.setState({ users: response.data })
  //       })
  // }

  render() {
    return (
      <div>
        <h1>  LOGGED IN </h1>
      </div>
    )
  }
};

