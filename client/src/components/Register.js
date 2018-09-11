import React from 'react';
import axios from 'axios';

class Register extends React.Component {
  state = {
    username : null
  }
  render(){
    return (
        <div>
          <label>First Name</label>
          <input type="text" placeholder = "First name"/>
          <br/>
          <label>Last Name</label>
          <input type="text" placeholder = "Last name"/>
          <br/>
          <label>Email</label>
          <input type="text" placeholder ="Email"/>
          <br/>
          <label>Username</label>
          <input type="text" placeholder ="Desired Username"/>
          <br/>
          <label>Birthday</label>
          <input type="text" place/>
          <br/>
          <label>
            Male
            <input type="checkbox"/>
          </label>
          <label>
            Female
            <input type="checkbox"/>
          </label>

          
          

        </div>
    )
  }
}

export default Register; 