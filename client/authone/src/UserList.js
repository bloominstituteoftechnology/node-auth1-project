import React, { Component } from 'react';
import axios from 'axios';

class UserList extends Component {
    constructor(props){
        super(props);
        this.state = {
            users: [{}]
        }
    }

    componentWillMount(){
        let promise = axios.get("http://localhost:5000/api/users")
        promise
            .then(res => {
                console.log("res", res);
                this.setState({users: res.data})
            })
        console.log(this.state, "after promise");
    }

    render() {
        return (
            <div className="userslist-wrapper">
                <h3 className="userslist-header">List of Users</h3>
                {this.state.users.map(user => {
                    return(
                        <div className="indiv-user" key={user.username}>
                            <h4>{user.username}User Placeholder</h4>
                        </div> 
                    )
                })}
            </div>
        );
    }
}

export default UserList;
