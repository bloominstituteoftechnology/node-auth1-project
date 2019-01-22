import React from 'react';

import App from './App'
import Authenticate from './Authenticate'
import PropTypes from 'prop-types';

class Home extends React.Component {
    constructor(){
        super();
        // this.state = {
        //     data: [],
        // }
    }

    componentDidMount(){
        console.log(this.props)
    }

    render(){
        console.log(localStorage.getItem('user'))
        console.log(localStorage.getItem('password'))

        return (
            <div>
                <App />
            </div>
        )
    }
}

Home.defaultProps = {
    data: []
}

Home.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            username: PropTypes.string,
        })
    ).isRequired
};

export default Authenticate(Home)