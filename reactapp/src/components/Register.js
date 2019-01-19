import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    };

    render() {
        return (
            <form>
                <input
                    placeholder='username'
                    value={this.state.username}
                    name='username'
                />
                <input
                    placeholder='password'
                    value={this.state.password}
                    name='password'
                />
            </form>
        )
    }
}

export default Register;
