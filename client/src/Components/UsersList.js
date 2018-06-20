import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

class UsersList extends Component {
    constructor() {
        super();
        this.state = {
            users: [{}]
        }        
    }

    componentWillMount() {
        axios
            .get('http://localhost:5555/api/restricted/users')
            .then(res => {
                console.log('data: ', res.data)
                this.setState({ users: res.data })
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {
        return (
            <div>
                <h3>List of Users</h3>
                {this.state.users.map(user => {
                    return (
                        <div>
                            <h5>{user.username}</h5>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default UsersList;