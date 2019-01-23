import React from 'react';
import { Redirect } from 'react-router'

const Authenticate = Component => {
    return class WrappedComponent extends React.Component {

        state = {
            loggedIn: false,
        }

        componentWillMount() {
            if (!localStorage.getItem('username')) {
                this.setState({ loggedIn: false });
            } else {
                this.setState({ loggedIn: true });
            }
        }

        render() {
            return !this.state.loggedIn ? <Redirect to="/login" /> : <Component />;
        }
    }
};

export default Authenticate;