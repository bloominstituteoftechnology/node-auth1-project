import React, { Component } from "react";
import axios from "axios";

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: ""
        };
    }

    register = event => {
        event.preventDefault();
        const user = {
            username: this.state.name,
            password: this.state.password
        };
        axios.post("http://localhost:5000/register", user).then(response => {
            this.props.history.push(`/`).catch(err => {
                console.log(err);
            });
        });

        this.setState({
            name: "",
            password: ""
        });
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <div className="App">
                <h2>Register New User: </h2>
                <div class='register-form'>
                    <div className="form-group">
                        <input className="form-control" placeholder="Username" name='title' type="text" value={this.state.username} onChange={this.handleInputChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Password" name='content' type="text" value={this.state.password} onChange={this.handleInputChange} />
                    </div>
                    <button type="submit" className="register-button" onClick={this.register}>
                        Register
            </button>
                </div>
            </div>
        );
    }
}

export default RegisterForm;