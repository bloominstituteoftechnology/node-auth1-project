import React from "react";

const UserList = (props) => {
    return(
        <div>
        {props.users.map(user => {
            return (
              <div key={user._id}>
                  <h1>{user.username}</h1>
              </div>
            );
        })}  
      </div>
    );
}

export default UserList;