import React, { Component } from 'react';
import "../App.css"
//import PropTypes from 'prop-types';

class User extends Component {
    constructor(props) {
        super(props);

      /*   this.state = {
            counter: 0,
            }; */

    }
  

   /*  increment = event => {
        event.preventDefault();
        this.setState(prevState => ({ counter: prevState.counter + 1 }));
    };
 */
    render() {
       
        return (
           
           <div className="user">
                <div className="username"> {this.props.user}</div>             
            </div>

        );
    };
}


export default User;