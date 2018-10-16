import React, { Component} from 'react';
import axios from 'axios';

// Components
import { User } from './index.js';

// Styles
import styled from 'styled-components';

const HomeDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	flex-direction: column;

	* {
		margin: 20px;
	}

	p {
		font-size: 2rem;
	}

	button {
		border-radius: 5px;
		padding: 5px 10px;

		&:hover {
			background-color: black;
			color: white;
			cursor: pointer;
		}
	}
`;

export default class Home extends Component {
	state = {
		users: [],
	};

	getUsers = e => {
		e.preventDefault();
		axios.defaults.withCredentials = true;
		return axios
			.get('http://localhost:5000/api/users')
			.then(res => {
				this.setState({ users: res.data });
			})
			.catch(err => console.log(err));
	};

	logOut = e => {
		e.preventDefault();
		axios.defaults.withCredentials = true;
		return axios
			.post('http://localhost:5000/api/logout')
			// logging in with an empty string as a username will effectively log out
			.then(message => this.props.logIn(''))
			.catch(err => console.log(err));
	};

	render() {
		return(
			<HomeDiv>
				<p>Welcome, { this.props.username }!</p>

				<button onClick = { this.logOut }>Log out</button>

				<button onClick = { this.getUsers }>Get a list of users</button>

				{ this.state.users.map((user, i) => <User key = { i } user = { user } />) }
			</HomeDiv>
		);
	}
};
