import React, {useState, useEffect, useContext} from 'react'

//context 
import {appContext} from '../context/appContext';
//imports
import axios from 'axios'


export default function LogIn() {

    const loggedIn = useContext(appContext).loggedIn;
    const setLoggedIn = useContext(appContext).setLoggedIn;
    const initialFormState = {
        username: '',
        password: ''
    }

    const [credentials, setCredentials] = useState(initialFormState)

    function onChange (e){
        console.log(e.target.value)
        setCredentials({...credentials, [e.target.name]: e.target.value });
    }

    function onSubmit (e){
        e.preventDefault();
        console.log(credentials)
        axios.post('http://localhost:2100/api/login', credentials)
        .then(res=>{
            console.log( res.data)
            setLoggedIn(true);
            alert(`${res.data.message} !`)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className = 'Login'>
            <h2>Log In</h2>
            <form onSubmit={onSubmit}>

            <label>
                Username :
                <input 
                name ='username'
                value = {credentials.username}
                onChange = {onChange}
                type="text"
                />
            </label>
            <label>
                Password :
                <input 
                name ='password'
                value = {credentials.password}
                onChange = {onChange}
                type="password"
                />
            </label>

            <button>Login</button>

            </form>
        </div>
    )
}
