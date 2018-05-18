import React, { Component } from "react";
import axios from "axios";

// connect to API: /api/register
// create a new user and send to the database via a cookie

class RegistrationForm extends Component {
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

	registerUser = event => {
		event.preventDefault();
		const user = this.state;
		axios
			.post("http://localhost:5000/api/register", user)
			.then(response => {
				console.log(response.data);
			})
			.catch(err => {
				console.error(err);
			});
		this.setState({ username: "", password: "" });
	};

	render() {
		// console.log(this.state.username);
		// console.log(this.state.password);
		return (
			<form onSubmit={this.registerUser}>
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

export default RegistrationForm;
