import React, { Component } from 'react';
import axios from 'axios';

class UserComponent extends Component {
  componentWillMount() {
    axios
      .get('http://localhost:3000/me')
      .then(user => {
        console.log(user);
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return <div>ME COMPONENT</div>;
  }
}

export default UserComponent;
