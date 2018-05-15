import React, {Component} from "react";
import "./Home.css"
import {Link} from "react-router-dom"
class Home extends Component {
    constructor() {
        super();
    }

    render(){
        return(
            <div className="login">
                    <button><Link to="/register">Register</Link></button>
                    <button><Link to="/login">Login</Link></button>
            </div>
        )
    }
}

export default Home