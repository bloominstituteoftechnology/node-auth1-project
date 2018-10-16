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
	height: 100vh;

	header {
		h1 {
			text-align: center;
			font-size: 5vh;
			padding: 2vh;
		}

		.links {
			a {
				color: white;
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

				<AuthComp />

				<Route path = '/restricted/:section' render = { props => <Area51 section = { props.match.params.section } /> } />
			</AppDiv>
		);
	}
}

export default App;
