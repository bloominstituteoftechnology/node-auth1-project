import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

// Components
import {
	Auth,
	Home,
	Login,
	Area51,
} from './components/index.js';

// Styles
import styled from 'styled-components';

const AppDiv = styled.div`
	background: #444;
	color: white;
	min-height: 100vh;

	header {
		h1 {
			text-align: center;
			font-size: 5vh;
			padding: 2vh;
		}

		.links {
			display: flex;
			justify-content: center;

			a {
				color: white;
				text-decoration: none;
				border: 1px solid black;
				border-radius: 5px;
				padding: 5px 10px;
				margin: 0 10px 10px;

				&:hover {
					background-color: black;
					cursor: pointer;
				}
			}
		}
	}
`;

const AuthComp = Auth(Home)(Login);

class App extends Component {
	render() {
		return (
			<AppDiv>
				<header>
					<h1>Authentication Project</h1>

					<div className = 'links'>
						<Link to = '/'>Home</Link>
						<Link to = '/restricted/Area51'>Go to Area 51</Link>
					</div>
				</header>

				<Route path = '/restricted/:section' render = { props => <Area51 section = { props.match.params.section } /> } />

				<AuthComp />
			</AppDiv>
		);
	}
}

export default App;
