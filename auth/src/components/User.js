import React, { Component } from 'react';
import "../App.css"

class User extends Component {
    constructor(props) {
        super(props);
 
    }
  
    render() {
       
        return (
           
           <div className="user">
                <div className="username"> {this.props.user}</div>             
            </div>
        );
    };
}


export default User;