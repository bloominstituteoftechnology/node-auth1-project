import React, { Component } from "react";
import axios from "axios";

// connect to API: /api/login
// log in an existing user
// otherwise if a user does not exist redirect user to Register

class LogIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: ""
		};
	}

	handleInput = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	logInUser = event => {
		event.preventDefault();
		const user = this.state;
		axios
			.post("http://localhost:5000/api/login", user)
			.then(response => {
				console.log(response.data);
			})
			.catch(err => {
				console.error(err);
			});
		this.setState({ username: "", password: "" });
	};

	render() {
		console.log(this.state.username);
		console.log(this.state.password);
		return (
			<form onSubmit={this.logInUser}>
				<h3>LOG IN HERE</h3>
				<label>
					Username:
					<input
						type="text"
						name="username"
						value={this.state.username}
						onChange={this.handleInput}
					/>
				</label>
				<label>
					Password:
					<input
						type="text"
						name="password"
						value={this.state.password}
						onChange={this.handleInput}
					/>
				</label>
				<button type="submit">Register</button>
			</form>
		);
	}
}

export default LogIn;
