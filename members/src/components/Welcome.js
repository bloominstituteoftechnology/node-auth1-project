import React, { Component } from 'react';
// import axios from 'axios';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    }
  };

  render() {
    return (
      <div>
        <h1>WELCOME!</h1>
        Welcome to the membership site!
      </div>
    )
  }
}