import React, { Component } from 'react';

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
	}
`;

class App extends Component {
	render() {
	return (
		<AppDiv>
			<header>
				<h1>Authentication Project</h1>
			</header>
		</AppDiv>
	);
	}
}

export default App;
