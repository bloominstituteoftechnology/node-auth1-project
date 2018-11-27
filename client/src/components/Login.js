import React, { Component } from 'react'
import axios from 'axios'

export default class Login extends Component {
    state = { user: '', loggedIn: false, update: '' }

    handleState = () => {
        this.setState({
            update : 'update state',
        })
    }

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
                this.setState({
                    user     : res.data,
                    loggedIn : true,
                })
            })
            .catch(e => {
                console.log(e)
            })

        this.handleState()
    }

    render() {
        return (
            <div>
                {!this.state.loggedIn && (
                    <form onSubmit={this.handleSubmit}>
                        <input type='text' placeholder='username' name='username' onChange={this.handleInput} />
                        <input type='text' placeholder='password' name='password' onChange={this.handleInput} />
                        <input type='submit' value='submit' />
                    </form>
                )}
            </div>
        )
    }
}
