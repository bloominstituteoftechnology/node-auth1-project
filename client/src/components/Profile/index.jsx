import React from "react";
import { Link } from "react-router-dom";

// TODO: create stateful component to grab the username and stuff for profile ata later date
const Profile = props => {
  return (
    <div>
      <h1>profile page you are logged in!</h1>
      <Link to="/logout">Logout</Link>
    </div>
  );
};

export default Profile;
