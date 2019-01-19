import React from 'react';
import '../App.css';


class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    inputHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleKeyUp = (e) => {
        if(e.keyCode === 13) return this.register()
    }

    register = (e) => {
        e.preventDefault();
        const newUser = {
            Username: this.state.username,
            Password: this.state.password
        }
        this.props.register(newUser);

        this.props.history.push('/login');        
    }

    render(){
    return(
        <div>
            <h1>Register for the Authenticator!</h1>
            <form onSubmit={this.register} onKeyUp={this.handleKeyUp}>
                <div>
                    <input 
                        onChange={this.inputHandler}
                        type ="text" 
                        placeholder="Username"
                        value={this.state.username}
                        name="username"
                    ></input>
                </div>

                <div>
                    <input 
                        onChange={this.inputHandler}
                        type ="password" 
                        placeholder="Password"
                        value={this.state.password}
                        name="password"
                    ></input>
                </div>

                <div className="button">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
    }
}

export default Register;