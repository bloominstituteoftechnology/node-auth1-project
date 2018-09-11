import React, { Fragment } from "react";
import { Login } from "../login/Login.js";

export const HomePage = props => {
  return (
    <div>
      <div className="homepageHeader">
        <h1>Welcome to the Top Secret Database of Users.</h1>
      </div>
      <Fragment>
        <Login />
      </Fragment>
    </div>
  );
};
