import React from 'react';
import {connect} from 'react-redux';

import {userLogin} from '../actions';

import LoginForm from './LoginForm';

class UserLogin extends React.Components {
    state = {
        user: {
            id: '',
            username: '',
            password: ''
        }
    };

    changeHandler = e => {
        this.setState({
            user: {
                ...this.state.user,
                [e.target.name]: e.target.value
            }
        });
    };

    login = () => {
        this.props.userLogin(this.state.user);
    };

    render() {
        return (
            <div>
                <LoginForm 
                    login={this.login}
                    changeHandler={this.changeHandler}
                    user={this.state.user}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({});

export default connect(
    mapStateToProps,
    {userLogin}
)(UserLogin);