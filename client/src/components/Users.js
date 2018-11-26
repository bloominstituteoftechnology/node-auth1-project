import React, { Component } from 'react';
import axios from 'axios';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            users: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:9000/api/users')
            .then(res => this.setState({
                users: res.data
            }))
            .catch(err => console.log(err));
    }

    render() { 
        const {users} = this.state;
        if (users) {
            return ( 
                <div>
                    {users.map(user => <p key={user.id}>{user.username}</p>)}
                </div>
             );
        } else {
            return (
                <div>Loading...</div>
            )
        }
    }
}
 
export default Users;