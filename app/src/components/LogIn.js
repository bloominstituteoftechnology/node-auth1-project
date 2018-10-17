import React from 'react';
import {logIn} from '../actions';
import {connect} from 'react-redux';

class LogIn extends React.Component{
    state = {
        username: '',
        password: ''
    };

    handleChange = event =>{
        this.setState({ [event.target.name]: event.target.value});
    };

    submit = event =>{
        event.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password
        }
        //log in
        this.props.logIn(user);
        this.setState({username:'', password:''});
    }

    render(){
        if(this.props.loggedIn){
            return(
                <div>
                    Logged in as "{this.props.username}"
                </div>
            )
        }else if(this.props.loggingIn){
            return(
                <div>Logging in...</div>
            )
        }else{
            return(
                <div>
                    <input 
                        type='text'
                        placeholder='username'
                        value={this.state.username}
                        name='username'
                        onChange={this.handleChange}
                    />
                    <input
                        type='text'
                        placeholder='password'
                        value={this.state.password}
                        name='password'
                        onChange={this.handleChange}
                    />
                    <div onClick={this.submit}>Submit</div>
                </div>
            )
        }
    }
}

const mapDispatchToProps = state => ({
    loggedIn: state.loggedIn,
    username: state.username,
    loggingIn: state.loggingIn
});

export default connect(mapDispatchToProps, {logIn})(LogIn);