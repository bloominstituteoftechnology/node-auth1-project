import React, { Component } from 'react';
import axios from 'axios';

// Styles
import styled from 'styled-components';

const LoginForm = styled.form`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	align-items: center;
	flex-direction: column;

	.input-div {
		margin: 10px;

		p {
			text-align: center;
			margin-bottom: 5px;
		}

		input {
			border-radius: 5px;
			padding: 5px;
		}
	}

	button {
		width: fit-content;
		border-radius: 5px;
		padding: 5px 10px;

		&:hover {
			background-color: black;
			color: white;
			cursor: pointer;
		}
	}

	.errmsg {
		margin: 15px;
		font-size: 1.1rem;
	}
`;

export default class Login extends Component {
	state = {
		username: '',
		password: '',
		errMsg: '',
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
			.catch(err => {
				const errorMsg = err.response.data.error;
				console.log(err);
				return this.setState({ errMsg: errorMsg });
			});
	};

	render() {
		const {
			username,
			password,
			errMsg,
		} = this.state;
		return(
			<LoginForm onSubmit = { this.handleSubmit }>
				<div className = 'input-div'>
					<p>Username:</p>
					<input
						name = 'username'
						placeholder = 'Enter username...'
						value = { username }
						onChange = { this.handleInputChange }
					/>
				</div>

				<div className = 'input-div'>
					<p>Password:</p>
					<input
						type = 'password'
						name = 'password'
						placeholder = 'Enter password...'
						value = { password }
						onChange = { this.handleInputChange }
					/>
				</div>

				<button type = 'submit'>Log in</button>

				{ errMsg && <p className = 'errmsg'>Failed to log in: { errMsg }</p> }
			</LoginForm>
		);
	}
};
