import React, { Component } from 'react';
import axios from 'axios';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }
    componentDidMount() {
        const endpoint = 'http://localhost:3600/api/users';

        axios
        .get(endpoint)
        .then(response => {
            this.setState(() => ({ users: response.data}));
        })
        .catch(error => {
            console.error('Server Error', error);
        });
    }
    render() {
        return (
            <div>
                <ul>
                    {this.state.users.map(user => {
                        return (
                            <li key={ user.id }>
                                name: { user.username },
                                password: { user.password }
                            </li>       
                        )
                    })}
                </ul>
            </div>
        )    
    }
}

export default Navbar;

