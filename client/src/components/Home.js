import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {withRouter} from 'react-router';  
import axios from 'axios'; 
import Login from './Login';

class Home extends React.Component{
  state = {
    username : null,
    users : []
  }

  componentWillUpdate() {
    const promise = axios.get('http://localhost:9000/api/users')
    promise
      .then(response => {
        console.log(response)
        this.setState({users: response.data, username: "someone"})
      })
      .catch(error => {
        console.error(error)
      })
  }
  render(){
    console.log(this.props)
    if (this.state.users.length){
      const users = this.state.users.slice()
      return (
        <div>
          {users.map((user, i) => {
            <div key = {i}>{user}</div>
          })}
        </div>
      )  
    } else {
      return <Login /> 
    }
  }
}

export default withRouter(Home); 