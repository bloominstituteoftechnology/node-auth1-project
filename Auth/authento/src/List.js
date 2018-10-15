import React from 'react';


const List = (props) => {
    console.log(props.users)
    return (
        <div>
             <hr/>
            <h1>Current Registered Users</h1>
            <div className="list">
                {props.users.map(user => (
                <p><strong>Info:</strong> {user.username.toUpperCase()}</p> 
                ))}
            </div>
        </div>
    );
};


// List.propTypes = {
//     PropTypes.shape({
//         name: React.propTypes.string.isRequired,
//         password: React.propTypes.node.isRequired
//     })
// }

export default List;