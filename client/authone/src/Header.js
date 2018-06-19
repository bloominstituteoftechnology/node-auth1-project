import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div className="header-wrapper">
               <h1 className ="headline-wrapper"> Please Log-in</h1>
               <div className="user-input">
               <label>Username:</label><input className="user-name" type="text" name="name"/>
               <label>Password:</label><input className="password" type="password" name="password"/>
               </div>
               <button>Log-In</button>
            </div>
        );
    }
}

export default Header;
