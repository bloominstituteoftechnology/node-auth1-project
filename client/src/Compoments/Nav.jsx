import axios from 'axios';
import React, { useContext } from 'react'
import {Link} from 'react-router-dom';

//import
import { appContext } from '../context/appContext';

export default function Nav() {

    const loggedIn = useContext(appContext).loggedIn;
    const setLoggedIn = useContext(appContext).setLoggedIn;

    function logout(){
        axios.get('http://localhost:2100/api/logout')
        .then(res=>{
            alert(`You have been logged out.`);
            setLoggedIn(false);
        }).catch(err=>{
            alert('Could not log out.')
            console.log(err)
        })
    }

    return (
        <div>
            <nav>
                <Link to = '/'>Home</Link>
                <Link to = '/users'>All Users</Link>
                <button onClick = {logout} to = '/logout'>Logout</button>
            </nav>
        </div>
    )
}
