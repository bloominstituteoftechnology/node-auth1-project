import React, { Component } from 'react';
import axios from "axios"
import {Link} from "react-router-dom"

class Register extends Component {
    constructor() {
        super();
        this.state={
            checked: false,
            type: "password",
            username: "",
            password: "",
        }
    }

    checkBox(){
        if(this.state.checked===false) {
            this.setState({
                checked: true,
                type: "text"
            })
        } else {
            this.setState({
                checked: false,
                type: "password"
            })
        }
    }

    handleInput = (e) => {
       this.setState({
           [e.target.name]: e.target.value
       })
    }

    handleSubmit = e => {
        e.preventDefault()
        const newUser = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post(("http://localhost:5000/register"), newUser)
        .then(sucessful => {
            alert("User created")
        }).catch(err => {
            alert("Could not create user")
            console.log(err)
        })
    }



    render() {
        return(
         <form onSubmit={this.handleSubmit}>
             <input onChange={this.handleInput} type="text" placeholder="Username" name="username"/>
             <input onChange={this.handleInput} type={this.state.type} placeholder="Password" name="password"/>
             <input onClick={() => {
                 this.checkBox()
             }} type="checkbox"/>
             <button type="submit">Submit</button>
         </form>
        )
    }
}

export default Register