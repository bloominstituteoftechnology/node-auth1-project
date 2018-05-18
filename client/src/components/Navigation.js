import React from "react";
import { Link } from "react-router-dom";
// styles
import "../styles/navigation.css";

const Navigation = () => {
	return (
		<div className="Navigation">
			<Link to={"/"}>
				<h3>Register</h3>
			</Link>
			<Link to={"/login"}>
				<h3>Log In</h3>
			</Link>
			<Link to={"/userprofile"}>
				<h3>Profile</h3>
			</Link>
			<Link to={"/users"}>
				<h3>Users</h3>
			</Link>
		</div>
	);
};

export default Navigation;
