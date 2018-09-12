import React from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
class Register extends React.Component {
  state = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: null,
    birthday: null,
    month: "January",
    day: 1,
    year: 1920,
    password: "",
    days: [],
    years: [],
    errorHeader: ""
  };
  componentWillMount() {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    const years = [];
    for (let i = 1920; i <= 2018; i++) {
      years.push(i);
    }
    this.setState({ days, years });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  addUser = postBody => {
    const promise = axios.post("http://localhost:9000/api/register/", postBody);
    promise
      .then(id => {
        if (id) {
          return this.props.history.push('/login')
          //, {some: 'state'} if needed in future. 
        } else {
          const errorHeader = "Issues with registering";
          this.setState({ errorHeader });
        }
      })
      .catch(error => {
        console.error("Server Error", error);
      });
  };
  onSubmit = () => {
    /*The purpose of this is to handle the registration. 
    First what must be done is a check for all required fields. 
    If all fields are completed then call the post command that will register the user
    The user will still be logged out upon registering and will require logging in still.*/
    let errorHeader = "";
    if (!this.state.terms === "on") {
      errorHeader += "Please accept terms and conditions!-";
    }
    if (!this.state.cookies === "on") {
      errorHeader += "Please accept cookies!-";
    }
    if (!this.state.gender) {
      errorHeader += "Please select a gender!-";
    }
    if (!this.state.month) {
      errorHeader += "Please select a birthday month!-";
    }
    if (!this.state.day) {
      errorHeader += "Please select a birthday day!-";
    }
    if (!this.state.year) {
      errorHeader += "Please select a birthday year!-";
    }
    if (!this.state.firstName) {
      errorHeader += "Please select a first name!-";
    }
    if (!this.state.lastName) {
      errorHeader += "Please select a last name!-";
    }
    if (!this.state.username) {
      errorHeader += "Please select a username!-";
    }
    if (!this.state.email) {
      errorHeader += "Please select a email!-";
    }
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const specialCharacters = [
      "!",
      "@",
      "#",
      "%",
      "$",
      "^",
      "&",
      "*",
      "(",
      ")",
      "-",
      "_",
      "+",
      "=",
      ".",
      "?",
      "/",
      "<",
      ">",
      ","
    ];
    const passwordSplitToArray = this.state.password.slice().split("");
    let specialCount = 0; 
    let numberCount = 0; 
    for(let i = 0; i<passwordSplitToArray.length; i++){
      if(specialCharacters.includes(passwordSplitToArray[i])){
        specialCount ++; 
      } else if (numbers.includes(passwordSplitToArray[i])){
        numberCount ++; 
      }
    }
    if(!specialCount && !numberCount && this.state.password.length < 10){
      errorHeader += "Password must include at least one number, and one special character \
       ! @ # % $ ^ & * ( ) _ + = . ? / < > , also it must be at least 10 characters long!-"
    }
    if (errorHeader.length) {
      this.setState({ errorHeader });
    } else {
      this.addUser({
        username: this.state.username,
        password: this.state.password
      });
    }
  };

  render() {
    const years = this.state.years.slice();
    const days = this.state.days.slice();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const errors = this.state.errorHeader.split("-");
    return (
      <div>
        {errors.map((error, i) => (
          <p key={i}>{error}</p>
        ))}
        <br />
        <label>First Name</label>
        <input
          onChange={this.onChange}
          name="firstName"
          type="text"
          placeholder="First name"
        />
        <br />
        <label>Last Name</label>
        <input
          onChange={this.onChange}
          name="lastName"
          type="text"
          placeholder="Last name"
        />
        <br />
        <label>Email</label>
        <input
          onChange={this.onChange}
          name="email"
          type="text"
          placeholder="Email"
        />
        <br />
        <label>Username</label>
        <input
          onChange={this.onChange}
          name="username"
          type="text"
          placeholder="Desired Username"
        />
        <br />
        <label>Password</label>
        <input
          onChange={this.onChange}
          name="password"
          type="password"
          value={this.state.password}
          placeholder="Choose a password"
        />
        <br />
        <label>
          Password must include a special character $!@#%^*_-+= a number and
          must be 10characters long
        </label>
        <br />
        <label>Birthday</label>
        <select onChange={this.onChange} name="month" id="birthday">
          {months.map((month, i) => (
            <option key={i} value={`${month}`}>
              {month}
            </option>
          ))}
        </select>
        <select onChange={this.onChange} name="day" id="day">
          {days.map((day, i) => (
            <option key={i} value={this.state.day}>
              {day}
            </option>
          ))}
        </select>
        <select onChange={this.onChange} name="year" id="year">
          {years.map((year, i) => (
            <option key={i} value={`${year}`}>
              {year}
            </option>
          ))}
        </select>
        <br />
        <label>
          Male
          <input
            onChange={this.onChange}
            type="checkbox"
            name="gender"
            value="male"
          />
        </label>
        <label>
          Female
          <input
            onChange={this.onChange}
            type="checkbox"
            name="gender"
            value="female"
          />
        </label>
        <br />
        <label>Terms and conditions</label>
        <input
          onChange={this.onChange}
          type="checkbox"
          name="terms"
          value={this.state.terms}
        />
        <br />
        <label>Acknowledge Cookies allowed</label>
        <input
          onChange={this.onChange}
          type="checkbox"
          name="cookies"
          value={this.state.cookies}
        />
        <br />
        <button onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }
}

export default Register;
