import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logOut} from '../actions';

class Navigation extends React.Component{
    render(){
        return(
            <Fragment>
                <div>
                    <Link to={'/'}>Home</Link>
                </div>
                {(this.props.loggedIn) ? (
                    <div>
                        <Link to={'/user-info'}>User Info</Link><br/>
                        <Link onClick={this.props.logOut} to={'/login'}>Log Out</Link>
                    </div>
                ) : (
                    <div>
                        <Link to={'/login'}>Log In</Link>
                    </div>
                )}
            </Fragment>
        )
    }
}

const mapDispatchToProps = state =>({
    loggedIn: state.loggedIn
});

export default connect(mapDispatchToProps, {logOut})(Navigation);