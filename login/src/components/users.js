import React from 'react';
import '../App.css';


const Users = (props) => {
    return(
        <div>
            <h1 className="header">Users</h1>
            <ul className='outerdiv'>
                {props.users.map(item => {
                    return (
                        <div key={item} className="user">
                            <p>{item}</p>
                        </div>
                    )
                })}
            </ul>
        </div>
    )
}

export default Users;