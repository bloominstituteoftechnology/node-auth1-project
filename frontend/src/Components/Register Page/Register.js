import React, { Component } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class Register extends Component {
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
		const user = {
			username: this.state.username,
			password: this.state.password
		};
		axios
			.post("http://localhost:3300/api/register", user)
			.then(res => console.log(res));
	};

	render() {
		return (
			<div className="Register">
				<Form onChange={this.handleChange} inline>
					<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
						<Label for="exampleEmail" className="mr-sm-2">
							Username:
						</Label>
						<Input
							type="text"
							name="username"
							id="idusername"
							placeholder="Username"
						/>
					</FormGroup>
					<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
						<Label for="examplePassword" className="mr-sm-2">
							Password:
						</Label>
						<Input
							type="password"
							name="password"
							id="examplePassword"
							placeholder="Password"
						/>
					</FormGroup>
					<Button onClick={this.onSubmit}>Submit</Button>
				</Form>
			</div>
		);
	}
}

export default Register;
