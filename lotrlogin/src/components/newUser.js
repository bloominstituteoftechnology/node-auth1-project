import React, { Component } from 'react';
import axios from 'axios';

class UserInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '',
            password: ''
         }
    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    postUser = user => {
        console.log(user)
        axios
            .post('http://localhost:8000/register', user)
            .then(response => {
                this.setState({ username: response.data, password: response.data })
            })
            .catch(error => {
                console.log(error)
            })
    }
 
    addUser = () => {
        console.log("here")
        const userInfo={ username: this.state.username, password: this.state.password}
        this.postUser(userInfo)
        this.setState({ username: '', password: '' })
    }

    render() { 
        return ( 
        <div>
            <form className="input">
                <input 
                    className="username-input"
                    onChange={this.handleInputChange}
                    placeholder="Enter Username"
                    name="username"
                    value={this.state.username}
                />
                <input
                    className="password-input"
                    onChange={this.handleInputChange}
                    placeholder="Enter Password"
                    name="password"
                    value={this.state.password}
                />
            </form>
            <button 
                className="submit-button"
                
                onClick={this.addUser}
            >
            ADD USER TO DATABASE
            </button>
        </div>
        )
    }
}
 
export default UserInputForm;