import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const Unauthorized = props => {
  return (
    <div className="unauthorizedContainer">
      <h1>You are not authorized!</h1>
      <p>
        <Link to="/register" className="button">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Unauthorized;
