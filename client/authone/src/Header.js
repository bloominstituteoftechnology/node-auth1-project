import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    //handleSubmit
    handleSubmit = (e) => {
        const { username, password } = this.state
        let promise = axios.post("http://localhost:5000/api/login", { username, password })
            promise
                .then(res => {
                    this.setState({
                        username: "", password: ""
                    });
                    console.log(this.state, "after post");
                    document.location.href=("http://localhost:3000/restricted/users");
                })
                .catch(err => {
                    console.log(err.message);
                });
    };

    //handleChange
    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }



    //simple Validation
    validateForm = () => {
        return((this.state.username.length > 0 && this.state.password.length > 0)?true:false);
         
        }

    render() {
        console.log(this.state);
        return (
            <div className="header-wrapper">
               <h1 className ="headline-wrapper"> Please Log-in</h1>
               <div className="user-input" onSubmit={this.handleSubmit}>
                  <label>Username:</label>
                    <input 
                        className="username" 
                        type="text" 
                        name="username" 
                        value={this.state.username} 
                        onChange={this.handleChange}/>
                  <label>Password:</label>
                    <input 
                        className="password" 
                        type="password" 
                        name="password" 
                        value={this.state.password} 
                        onChange={this.handleChange}/>
               </div>
               <button disabled={!this.validateForm()} type="submit" onClick={this.handleSubmit}>Log-In</button>
            </div>
        );
    }
}

export default Login;
