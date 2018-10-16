import React, { Component } from 'react';
import axios from 'axios';

export default class Area51 extends Component {
	state = {
		message: '',
	};

	componentDidMount() {
		if (!this.state.message) {
            axios.defaults.withCredentials = true;
            return axios
                .get(`http://localhost:5000/api/restricted/${ this.props.section }`)
                .then(res => {
                    return this.setState({ message: res.data.message })
                })
                .catch(err => {
					this.setState({ message: err.response.data.error });
				});
        }
	};

	render() {
		return(
			<div>
				{ this.state.message && <p>{ this.state.message }</p> }
			</div>
		);
	}
};
