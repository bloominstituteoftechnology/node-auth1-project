import React, { Component } from 'react';
import axios from 'axios';

class UserPage extends Component {
    componentDidMount() {
        axios
          .get('http://localhost:3000/me')
          .then(stuff => {
              console.log(stuff);
    })
          .catch(err => {
              console.error(err);
          })
}
render() {
    return <div>USER PAGE</div>;
}
}

export default UserPage; 