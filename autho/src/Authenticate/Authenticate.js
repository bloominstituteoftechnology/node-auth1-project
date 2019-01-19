import React from "react";
import Register from "../Register/register";
// import Login from '../Login/login'
// import axios from 'axios';


const Authenticate = App =>
    class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loggedIn: false
            };
        }
        componentDidMount = () => {

        };

        render() {
            // return <App />
            if (this.state.loggedIn) return <App />;
            return <Register />;

        }
    };
export default Authenticate;
