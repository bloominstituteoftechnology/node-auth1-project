import React, { Component } from 'react';
import axios from 'axios';

class Users extends Component {
	constructor(props){
		super(props);
		this.state = {
			users: []
		}
	}

	componentDidMount(){
		axios.get('http://localhost:9000/api/users')
			.then(res => {
				this.setState({
					users: res.data
				})
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		if (this.state.users.length < 1) return <div></div>
		return (
			<div>
				{this.state.users.map(user => {
					return (
						<div key={user.id}>
							{user.username}
						</div>
					)
				})}
			</div>
		);
	}
}

export default Users;