import React from 'react';
import axios from 'axios';

class UserInfo extends React.Component{
    state = {
        users: []
    }

    componentDidMount(){
        axios
            .get('http://localhost:8000/users')
            .then(users=>{
                this.setState({users: users});
            })
            .catch(err => console.error(err.message));
    }
    render(){
        return(
            <div>
                {this.state.users}
            </div>
        )
    }
}

export default UserInfo;