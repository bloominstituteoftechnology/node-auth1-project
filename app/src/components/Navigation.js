import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logOut} from '../actions';

class Navigation extends React.Component{
    render(){
        return(
            <div>
                <div>
                    <Link to={'/'}>Home</Link>
                </div>
                <div>
                    <Link to={'/login'}>Log In</Link>
                </div>
                {(this.props.loggedIn) ? (
                    <div onClick={this.props.logOut}>Log Out</div>
                ) : (
                    <div/>
                )}
            </div>
        )
    }
}

const mapDispatchToProps = state =>({
    loggedIn: state.loggedIn
});

export default connect(mapDispatchToProps, {logOut})(Navigation);