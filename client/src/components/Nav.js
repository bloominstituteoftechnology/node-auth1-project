import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    return (
        <div className='nav-container'>
            <Link to='/users'> Users</Link>
            <Link to='/login'> Login</Link>
            <Link to='/register'>Register</Link>
        </div>
    );
}

export default Nav;