import React from 'react';
import { Link } from 'react-router-dom';

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        
        }
    }


    render() {
        return (
            <div>
                <Link to='/register' style={{textDecoration: 'none'}}>
                    <p>
                    Click here to Register
                    </p>
                </Link>

                <Link to='/login' style={{textDecoration: 'none'}}>
                    <p>
                        Click here to Login
                    </p>
                </Link>
            </div>
        )
    }
};

export default Welcome;