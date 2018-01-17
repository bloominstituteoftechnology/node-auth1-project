import React, { Component } from 'react';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        }
    }
render() {
    return (
        <form>
            <input
            type ="text"
            onChange={this.handleInputChange}
            value={this.state.email}
            placeholder="email"
            name="email"
            />
            </form>
    );
}
}

export default SignUp; 