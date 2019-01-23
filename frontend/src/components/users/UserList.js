import React from 'react';
import axios from 'axios';
import UserItem from './UserItem';

import Authenticate from '../authentication/Authenticate';

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            loading: false,
            users: []
        }
    }

    componentDidMount() {
        this.setState({...this.state, loading: true});
        axios.get('http://localhost:5000/api/users')
            .then(response => {
                console.log(response.data);
                this.setState({error: null, loading: false, users: response.data});
            })
            .catch(err => {
                console.log(err);
                this.setState({error: "Unable to retrieve users from server", loading: false, users: []});
            })

    }

    render() {
        return (
            <React.Fragment>
                <header>
                    <h2>Users:</h2>
                </header>
                <section className="user-list">
                    { this.state.loading === true ? <h3>Loading...</h3>: null }
                    { this.state.error !== null ? <h3>{this.state.error}</h3> : null }
                    { this.state.users.map(user => <UserItem user={user} key={user.id} /> ) }
                </section>
            </React.Fragment>
        )
    }
}

export default Authenticate(UserList);