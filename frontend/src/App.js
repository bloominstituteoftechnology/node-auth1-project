import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { Link } from "react-router-dom";

class App extends Component {
	render() {
		return (
			<div className="App">
				<div>
					<h1>Welcome to the App!</h1>
					<Link to="/register">Register</Link>
					<Link to="/login">Login</Link>
				</div>
			</div>
		);
	}
}

export default App;
