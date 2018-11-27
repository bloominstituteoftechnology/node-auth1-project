import React, { Component } from 'react'
import axios from 'axios'

export default class Login extends Component {
    state = {}

    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleSubmit = () => {
        const { username, password } = this.state
        axios
            .post('http://localhost:9000/api/register', { username, password })
            .then(res => {
                return <div>{res.data}</div>
            })
            .catch(e => {
                console.log(e)
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type='text' placeholder='username' name='username' onChange={this.handleInput} />
                <input type='text' placeholder='password' name='password' onChange={this.handleInput} />
                <input type='submit' value='submit' />
            </form>
        )
    }
}
