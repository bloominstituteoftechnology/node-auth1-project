import React, {Component} from 'react';
import axios from 'axios';
import User from './user';

const url = 'http://localhost:5000/users';

class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            users: []
         };
    }


    componentDidMount() {
        axios.get(url)
            .then(data => {
                this.setState({
                    users: data.data
                })
            })
            .catch(error => {
                console.log(error);
            })
    }


    render() { 
        return ( 
            <div>
                {this.state.users.map(user => (
                    
                        <User
                            key={user.id}
                            id={user.id}
                            name={user.username}
                            password={user.password}
                            generated={user.generated}
                        />
                    
                ))}
            </div>
         );
    }
}
 
export default UsersList;