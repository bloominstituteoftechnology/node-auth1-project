import React, { Component } from 'react';

const Auth = Home => Login => class extends Component {
    state = {
		username: '',
	};

	logIn = (username) => {
		this.setState({ username: username });
	};

    render () {
        if (this.state.username) {
            return <Home username = { this.state.username } />;
        } else {
            return <Login logIn = { this.logIn } />;
        }
    }
}

export default Auth;
