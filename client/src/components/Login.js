import React, { Component } from 'react';
import axios from 'axios';

// Styles
import styled from 'styled-components';

const LoginForm = styled.form`
`;

export default class Login extends Component {
	state = {
		username: '',
		password: '',
	};

	handleInputChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = e => {
		e.preventDefault();
		axios.defaults.withCredentials = true;
		return axios
			.post('http://localhost:5000/api/login', this.state)
			.then(res => {
				this.props.logIn(res.data.welcome);
			})
			.catch(err => console.log(err));
	};

	render() {
		return(
			<LoginForm onSubmit = { this.handleSubmit }>
				Username:
				<input
					name = 'username'
					placeholder = 'Enter username...'
					value = { this.state.username }
					onChange = { this.handleInputChange }
				/>

				Password:
				<input
					type = 'password'
					name = 'password'
					placeholder = 'Enter password...'
					value = { this.state.password }
					onChange = { this.handleInputChange }
				/>

				<button type = 'submit'>Log in</button>
			</LoginForm>
		);
	}
};
