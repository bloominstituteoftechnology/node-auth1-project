import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';

const Users = (props) => {
    const [users, setUsers] = useState([]);

    const getUsers = () => {
        axiosWithAuth().get('http://localhost:4000/api/users')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err.response));
    };

    useEffect(() => {
        getUsers();
    })

    return (
        <div>
            <h2>Users</h2>
            {users.map(user => 
               <h3>{user.username}</h3> 
            )}
        </div>
    )
}

export default Users;