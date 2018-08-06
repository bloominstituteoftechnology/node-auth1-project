import React from 'react';
import axios from 'axios';

class Users extends React.Component {
    constructor() {
        super();

        this.state = {
            users: []
        }
    }

    componentDidMount() {
        axios
            .get('http://localhost:8000/api/users')
            .then(response => this.setState({ users: response.data }))
            .catch(err => console.log(err));
    }

    render() {
        console.log(this.state.users);
        return (
            <div> Users</div >
        );
    }
}

export default Users;