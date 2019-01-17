import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import {FormGroup} from '../Styles/styles'


class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: "",
            password: ""
        }

    }
    render(){
        return (
            <div>
            <FormGroup>
                <input type="text" placeholder='Username' name='username'
                    value={this.state.username}
                    onChange={this.handleInputChange}
                />
                <input type="password" placeholder="Password"
                    name='password'
                    value={this.state.password}
                    onChange={this.handleInputChange}
                />
                <Button color="Primary"
                    variant="contained"
                    onClick ={this.handleLogin}
                >
                    Login
                </Button>

                </FormGroup>
            </div>

        )
    }
}


export default Login;