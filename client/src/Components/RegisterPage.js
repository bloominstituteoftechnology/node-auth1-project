import React from 'react'; 
import axios from 'axios'; 

class RegisterPage extends React.Component{
    constructor(){
        super(); 
        this.state = {
            username: '', 
            password: '', 
            loggedIn: false, 
        }
    }

    inputChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    createAccountHandler = () => {
        const user = {
            username: this.state.username, 
            password: this.state.password
        }
        axios.post("http://localhost:3400/api/register", user).then(id => {
            console.log(id); 
        }).catch(err => {
            console.log(err)
        })
    }

    render(){
        return (
            <div className = "register">
                <h1>Create a New Account</h1>
                <div className = "form">
                    <input onChange = {this.inputChangeHandler} name = "username" type = "text" placeholder = "Choose a username"/>
                    <input onChange = {this.inputChangeHandler} name = "password" type = "text" placeholder = "Choose a password" />
                    <button onClick = {this.createAccountHandler} >Create Account</button>
                </div>
            </div>
        )
        
    }
}

export default RegisterPage; 