import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class Home extends Component {
	constructor() {
		super();
		this.state = {
			users: []
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
	userSubmit = event => {
		event.preventDefault();
		axios.get("http://localhost:3300/api/users").then(res => {
			this.setState({
				users: res.data
			});
		});
	};

	render() {
		return (
			<div className="Register">
				<h1>Hi there! You are logged in now!</h1>
				<Button onClick={this.onSubmit}>Log Out</Button>
				<br />
				<Button onClick={this.userSubmit}>See all users</Button>
				{this.state.users.map(user => (
					<div className="user" key={user.id}>
						<h3>Name: {user.username}</h3>
					</div>
				))}
			</div>
		);
	}
}

export default Home;
