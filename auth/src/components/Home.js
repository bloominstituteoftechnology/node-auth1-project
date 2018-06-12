import React from "react";
import { Link, NavLink } from "react-router-dom";

    const Home = props => {
          return (
                <div className= "App" >
                  <NavLink to="/register" > Register </NavLink >
                  <NavLink to="/login" > Login </NavLink >
                </div >
            );
        };

export default Home;