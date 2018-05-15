import React, { Component } from 'react';
import axios from 'axios';

import '../styles.css';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers = () => {
        axios.get(`http://localhost:5000/api/users`)
        .then(users => {
            this.setState({ users: users.data })
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div>
                {this.state.users.map(users => {
                    return (
                        <h3>{users.username}</h3>
                    )
                })}
            </div>
        )
    }
}

export default Users;