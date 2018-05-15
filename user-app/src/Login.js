import React from 'react';
import axios from 'axios';
import './App.css';

export default class Login extends React.Component {
	state = {
		username: '',
		password: '',
		response: '',
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};
	handleSubmit = event => {
		event.preventDefault();
		axios
			.post('http://localhost:8000/login', {
				username: this.state.username,
				password: this.state.password,
			})

			.then(response => {
				console.log(response);
				if (response.data.username) {
					this.setState({
						response: `Welcome ${this.state.username}`,
					});
				}
			})
			.catch(err => {
				console.log(err);
				this.setState({ response: 'login error' });
			});
	};

	render = () => {
		return (
			<div className="loginForm">
				<form onSubmit={this.handleSubmit}>
					<input name="username" onChange={this.handleChange} />
					<input name="password" type="password" onChange={this.handleChange} />
					<button type="submit">Login</button>
				</form>
				<p>{this.state.response}</p>
			</div>
		);
	};
}
