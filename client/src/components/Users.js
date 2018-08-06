import React from 'react';
import axios from 'axios';

class Users extends React.Component {
    constructor() {
        super();

        this.state = {
            users: [],
            loggedin: null,
        }
    }

    componentDidMount() {
        axios
            .get('http://localhost:8000/api/users')
            .then(response => this.setState({ users: response.data }))
            .catch(err => {
                err.response.status === 401 ? this.setState({ loggedin: false }) : null;
            });
    }

    render() {
        if (!this.state.loggedin) {
            return (
                <div>
                    <p>You need to be logged in to view this!</p>
                    <button>Login</button>
                </div>
            );
        }

        return (
            <div>
                {this.state.users}
            </div >
        );
    }
}

export default Users;