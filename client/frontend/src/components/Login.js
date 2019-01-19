import React from 'react';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }


    render() {
        return (
            <div>
                I'm the Login page
            </div>
        )
    }
};

export default Login;