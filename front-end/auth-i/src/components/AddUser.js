import React from 'react';
import {connect} from 'react-redux';

import {addUser} from '../actions';

import UserForm from './UserForm';

class AddUser extends React.Components {
    state= {
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

    registerUser = () => {
        this.props.addUser(this.state.user);
    };

    render() {
        return (
            <div>
                <UserForm
                    registerUser={this.registerUser}
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
    {addUser}
)(AddUser);