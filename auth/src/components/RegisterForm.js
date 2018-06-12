import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    register = event => {
        event.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password
        };
        axios.post("http://localhost:5000/register", user).then(response => {
            this.props.history.push(`/`).catch(err => {
                console.log(err);
            });
        });

        this.setState({
            username: "",
            password: ""
        });
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        console.log(this.props.history)
        return (
            <div className="App">
                <h2>Register New User </h2>
                <div className='register-form'>
                    <div className="form-group">
                        <input className="form-control" placeholder="Username" name='username' type="text" value={this.state.username} onChange={this.handleInputChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Password" name='password' type="text" value={this.state.password} onChange={this.handleInputChange} />
                    </div>
                    <div className='register-buts'>
                        <button type="submit" className="register-button" onClick={this.register}>
                            Register
                        </button>
                        <Link to="/">
                            <button className="home-button">
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterForm;