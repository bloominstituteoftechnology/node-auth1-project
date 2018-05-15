import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
          users: [],
          username: '',
          password: ''
        };
      }
      componentDidMount() {
        this.bob();
      }

      bob = () => {
        axios
          .get(`http://localhost:5000/api/restricted/users`)
          .then(response => {
            this.setState({ users: response.data })
          })
          .catch(err => {
            console.log(err);
          })
      }


    render(){
        const {user} = this.props;
        return (
            <div>
                {this.props.users.map(user => {
                    return (
                        <h3>{user.username}</h3>
                    )
                })}
                
            </div>
        )
    }
} 

export default Users;