import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function homeLink() {
    return (window.location.href = "/");
}

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: false,
            errorMessage: ''
        };
    }


    register = event => {
        event.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password
        };
        axios.post("http://localhost:5000/register", user).then(response => {
            this.props.history.push(`/`)
            console.log(response)
            // window.location.href = "/"
            this.setState({
                error: false
            });
        })
        .catch(err => {
            this.setState({
                error: true,
                errorMessage: err.response.data.error
            })
            // console.log(err.response.data)
        })
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <div className="App">
                <h2>Register New User </h2>
                <div className={this.state.error ? "error" : "hidden"}>
                    {this.state.errorMessage}
                </div>
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