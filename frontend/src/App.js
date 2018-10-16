import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    id: 0,
	    title: '',
	    text: ''
	};
    }

    handleInputChange = e => {
	this.setState({ [e.target.name]: e.target.value});
    };

    handleSubmit = event => {
	event.preventDefault();
	window.location.reload();

	axios.post('http://localhost:3000/', {username: this.state.username, password: this.state.password})
	    .then(response => {
		console.log(response);
		console.log(response.data);
	    });	
    }
    
    render() {
	return (
	    <div className="App">
              <form onSubmit={this.handleInputChange}>
		<input className='title'
		       onChange={this.handleInputChange}
		       placeholder="username"
		       value={this.state.username}
		       name="title"
		       />
                <br/>
		<input className='title'
		       onChange={this.handleInputChange}
		       placeholder="password"
		       value={this.state.password}
		       name="title"
		       />
                <br/>
                <button type='submit'>Log In</button>
              </form>
	    </div>
	);
    }
}

export default App;
