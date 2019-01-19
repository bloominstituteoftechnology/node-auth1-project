import React from 'react'



const User = user => {
    return (

        <div>
            <h2>{user.id}</h2>
            <h2>{user.username}</h2>
        </div>
    )
}


export default User;