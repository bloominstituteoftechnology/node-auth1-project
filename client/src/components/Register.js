import React, { Component } from 'react';
import axios from "axios";

class Register extends Component {
    constructor(props) {
      super(props);
      this.state = {
          username: "",
          password: "",
      };
    }

    changeHandler = e => {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }
    
    createUser = e => {
    e.preventDefault();
    if (this.state.username !== "" || this.state.password !== "") {
        axios.post("http://localhost:9001/api/register", this.state)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
    this.setState({username: "", password: ""})
    }

    render() {
        return(
            this.props.loggedIn ?
                null :
                <section>
                <h2>Register</h2>
                <form type="submit" onSubmit={this.createUser}>
                    <input 
                        onChange={this.changeHandler}
                        type="text" 
                        placeholder="username"
                        name="username"
                        value={this.state.username}
                        >
                    </input>
                    <input 
                        onChange={this.changeHandler}
                        type="text" 
                        placeholder="password"
                        name="password"
                        value={this.state.password}
                        >
                    </input>
                    <input type="submit" value="Submit" onClick={this.createUser}></input>
                </form>
                </section>
        )
    }
}

export default Register;