import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import Register from "./Components/Register Page/Register";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Register />
			</div>
		);
	}
}

export default App;
