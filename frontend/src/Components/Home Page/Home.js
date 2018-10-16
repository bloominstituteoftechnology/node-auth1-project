import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class Home extends Component {
	constructor() {
		super();
		this.state = {
			username: "",
			password: ""
		};
	}
	handleChange = event => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onSubmit = event => {
		axios.get("http://localhost:3300/logout").then(res => {
			if (res) {
				this.props.history.push("/");
			} else {
				this.props.history.push("/");
			}
		});
	};

	render() {
		return (
			<div className="Register">
				<h1>Hi there! You are logged in now!</h1>
				<Button onClick={this.onSubmit}>Log Out</Button>
			</div>
		);
	}
}

export default Home;
