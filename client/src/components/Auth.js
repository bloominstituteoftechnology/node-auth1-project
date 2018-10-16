import React, { Component } from 'react';
import axios from 'axios';

const Auth = Home => Login => class extends Component {
    state = {
		username: '',
	};

	logIn = (username) => {
        this.setState({ username: username });
    };

    componentDidMount() {
        if (!this.state.username) {
            axios.defaults.withCredentials = true;
            return axios
                .get('http://localhost:5000/api/checklogin')
                .then(res => {
                    const username = res.data;
                    if (username) {
                        return this.setState({ username: username });
                    }
                })
                .catch(err => console.log(err));
        }
    };

    render () {
        if (this.state.username) {
            return <Home username = { this.state.username } logIn = { this.logIn } />;
        } else {
            return <Login logIn = { this.logIn } />;
        }
    }
}

export default Auth;
