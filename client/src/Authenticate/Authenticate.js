import React from 'react';
import axios from 'axios';
import AuthDisplay from './AuthDisplay';
import { connect } from 'react-redux';
import {LogInAction} from '../actions/actions';
// import { stat } from 'fs/promises';

class Authenticate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            credentials: {
                // username: '',
                // password: ''
            },
            loggedIn: false
        }
    }
    handleTextInput = e => {
        e.preventDefault();
        // const state = this.state.credentials;
        // state[e.target.name] = e.target.value;
        // this.setState({credentials: state});
        let name = e.target.name
        name = e.target.value;
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({[e.target.name]: e.target.value})
    };
    sendCredentials = () => {
        // e.preventDefault
        // let {username, password} = this.state.credentials;
        let username = this.state.username;
        let password = this.state.password;
        const newObject = {
            username: username,
            password: password
        };
        let userObject = {
            username: username,
            loggedIn: true
        }
        console.log('This is the Authentication Credentials',newObject);
        // axios.post('http://localhost:8000/api/login/', {username, password})
        axios.post('http://localhost:8000/api/login/', newObject)
    
        .then(res => {
            console.log('this is the response for log in',res);
                this.setState({credentials: {}, username: '', password: ''});
                if (res) {
                    this.setState({loggedIn: true})
                    this.props.LogInAction(userObject);
                }
                this.props.fetchData;

            })
    };
    logout = () => {
        // e.preventDefault();
        console.log('this is the state:', this.state.loggedIn)
        this.setState({loggedIn: false});
        this.props.fetchData;
    };
    componentDidMount = () => {
      
    }
    render() {
        return (
            <div>
                <input
                    type="text"
                    onChange={this.handleTextInput}
                    placeholder="Enter username"
                    name="username"
                    value={this.state.username}
                    />
                                    <input
                    type="text"
                    onChange={this.handleTextInput}
                    placeholder="Enter password"
                    name="password"
                    value={this.state.password}
                    />
                    <button onClick={() => this.sendCredentials()}>
                    Send Credentials
                    </button>
                
                    <button onClick={() => this.logout()}>
                    logOut
                    </button>
                    {this.state.loggedIn ? <AuthDisplay /> : <h1>PLease Log in</h1>}
                </div>
        )
    }
    
}

const mapDispatchProps = (state) => {
    return {
        user: state.users,
    };
};

// export default Authenticate;
export default connect(mapDispatchProps, {LogInAction})(Authenticate);