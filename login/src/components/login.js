import React from 'react';
import '../App.css';


class Login extends React.Component {
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

    login = (e) => {
        e.preventDefault();
        const loginUser = {
            Username: this.state.username,
            Password: this.state.password
        }
        this.props.login(loginUser);

        this.props.history.push('/users');
    }

    render(){
    return(
        <div>
            <h1>Login tothe Authenticator!</h1>
            <form onSubmit={this.login} onKeyUp={this.handleKeyUp}>
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
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
    }
}

export default Login;