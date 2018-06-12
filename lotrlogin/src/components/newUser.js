import React, { Component } from 'react';
import axios from 'axios';

class UserInputForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '',
            password: '',
            responseMessage: '',
            loggedIn: false,
            users: [],
         }
    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    addUser = () => {
        const userInfo={ username: this.state.username, password: this.state.password}
        axios
            .post('http://localhost:8000/register', userInfo)
            .then(response => {
                this.setState({ username: '', password: ''})
            })
            .catch(error => {
                console.log(error)
            })
    }
    
    showUsers = () => {
        console.log("Start showing users?")
        axios
            ('http://localhost:8000/users',{
                method: 'get'
            })
            .then(response => {
            
                this.setState({ users: response.data.users, loggedIn: true })
            })
            .catch(error => {
                console.log(error)
            })
    }

    login = () => {
        const credentials={ username: this.state.username, password: this.state.password }
        axios
            .post('http://localhost:8000/login', credentials)
            .then(response => {
                this.setState({ username: '', password: '', responseMessage: response.data, loggedIn: true })
                this.showUsers()
            })
            .catch(error => {
                console.log(error)
            })
    }

    logout = () => {
        axios
            .get('http://localhost:8000/logout')
            .then(response => {
                this.setState({ loggedIn: false, responseMessage: response.data })
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() { 
        console.log(this.state.users)
        return ( 
        <div>
            <div style={{ paddingTop: "15px" }}>
                {this.state.responseMessage}
            </div>
            <div style={{ paddingTop: "15px" }}>
                {this.state.users.map(user => 
                        <div key={user._id}>
                            <h3 className="list-user">{user.username}</h3>
                        </div>
                    
                )}
            </div>
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
            Sign Up
            </button>
            { this.state.loggedIn
            ? 
            <button
                className="logout-button"
                onClick={this.logout}
            >
            Log out
            </button>
            :            
            <button 
                className="login-button"
                onClick={this.login}
            >
            Login
            </button>
            }
        </div>
        )
    }
}
 
export default UserInputForm;
