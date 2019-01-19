import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import RegisterForm from './RegisterForm'
import Users from '../Users/users'
import Login from '../Login/login'
import axios from 'axios'
import { Navigation, Header } from '../Styles/styles'
import "../App.css";



class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            username: "",
            password: "",
            completed: false,
            logedIn: false
        }
    }

    // componentDidMount() {
    //     axios.get("http://localhost:4300/api/users").then(
    //         reponse => {
    //             this.setState({
    //                 users: reponse.data})
    //         }
    //     ).catch(err => {
    //     console.log("nothing returned", err)
    //     }
    //     )
    // }
    registerUser = (users) => {
        axios.post('http://localhost:4300/api/register', users)
            .then(response => {
                this.setState({
                    completed:true
                })
            })
            .catch(err => {
                console.log("Error", err)
            })
    }

    loginUser = (users) => {
        axios.post('http://localhost:4300/api/login', users)
            .then(response => {
                this.setState({
                    loggedIn:true
                })
            })
            .catch(err => {
                console.log('Err', err)
            })
    }

    render() {
        return (
            <div>
                <Header>
                    <h1>auth-i</h1><br />
                    <h2>Application</h2>
                </Header>
<Navigation>
                <NavLink to="/register" className='nav-link'> Register </NavLink>
                <NavLink to="/login" className='nav-link'> Login</NavLink>
</Navigation>

                <Route path='/register' render={props => <RegisterForm {...props} register={this.registerUser} />} />
                <Route path='/login' render={props => <Login {...props} login={this.loginUser} />} />
                <Route path='/users' render={props => <Users {...props} users={this.state.users}/> } />
            </div>
        )
    }
}


export default Register;