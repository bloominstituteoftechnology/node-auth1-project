import React from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
class Register extends React.Component {
  state = {
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    gender: null,
    birthday: null,
    month: null,
    day: null,
    year: null,
    days: [],
    years: []
  };
  componentWillMount(){
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    const years = [];
    for (let i = 1920; i <= 2018; i++) {
      years.push(i);
    }
    this.setState({ days, years})
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    console.log(this.state)
    const years = this.state.years.slice(); 
    const days = this.state.days.slice(); 
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
      <div>
        <label>First Name</label>
        <input onChange ={this.onChange} name="firstName" type="text" placeholder="First name" />
        <br />
        <label>Last Name</label>
        <input onChange ={this.onChange} name="lastName" type="text" placeholder="Last name" />
        <br />
        <label>Email</label>
        <input onChange ={this.onChange} name="email" type="text" placeholder="Email" />
        <br />
        <label>Username</label>
        <input onChange ={this.onChange} name="username" type="text" placeholder="Desired Username" />
        <br />
        <label>Birthday</label>
        <select onChange ={this.onChange} name="month" id="birthday">
          {months.map((month, i) => <option key = {i} value={`${month}`}>{month}</option>)}
        </select>
        <select onChange ={this.onChange} name="day" id="day">
          {days.map((day,i) => <option key= {i} value = {`${day}`}>{day}</option>)}
        </select>
        <select onChange ={this.onChange} name="year" id="year">
          {years.map((year, i) => <option key={i} value={`${year}`}>{year}</option>)}
        </select>
        <br />
        <label>
          Male
          <input onChange ={this.onChange} type="checkbox" name="gender" value ="male" />
        </label>
        <label>
          Female
          <input onChange ={this.onChange} type="checkbox" name ="gender" value = "female"/>
        </label>
        <br/>
        <label>Terms and conditions</label>
        <input onChange ={this.onChange} type ="checkbox" name="terms"/>
        <br/>
        <label>Acknowledge Cookies allowed</label>
        <input onChange ={this.onChange} type ="checkbox" name ="cookies"/> 
        <br/>
        <button>Submit</button>
      </div>
    );
  }
}

export default Register;
