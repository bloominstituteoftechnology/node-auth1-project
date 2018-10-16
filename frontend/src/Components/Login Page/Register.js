import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class Register extends Component {
	constructor(props) {
		super(props);
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
		axios.post("http://localhost:3300/api/register", user).then(res => {
			console.log(res);
			if (res.data.id) {
				this.props.history.push("/home");
			} else {
				this.props.history.push("/register");
			}
		});
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
					<Button onClick={this.onSubmit}>Register</Button>
				</Form>
				<>
					<h6>
						Already signed up? Click <Link to="/login">Here</Link> to login.
					</h6>
				</>
			</div>
		);
	}
}

export default withRouter(Register);
