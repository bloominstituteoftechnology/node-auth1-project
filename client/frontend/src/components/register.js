import React from 'react';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    inputHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    submitHandler = (e) => {
        e.preventDefault();
        this.props.registerUser(this.state.username, this.state.password);
        this.setState({ username: '', password: ''});
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="registerContainer">
                <form onSubmit={this.submitHandler}>
                    <p><input type="text" placeholder="username" className="textField" name="username" value={this.state.username} onChange={this.inputHandler}></input></p>
                    <p><input type="password" placeholder="password" className="textField" name="password" value={this.state.password} onChange={this.inputHandler}></input></p>
                    <p><input type='submit' value='Submit'></input></p>
                </form>
            </div>
        )
    }
};

export default Register;