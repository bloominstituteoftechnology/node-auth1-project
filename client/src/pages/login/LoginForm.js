import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Redirect } from 'react-router-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirect: false
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  inputSpitter = (name, type="text", handler=this.handleInputChange) => {
    return <Input 
      type={type} 
      name={name} 
      value= {this.state[name]} 
      onChange={handler}
    />;
  }

  formSubmit = (e) => {
    e.preventDefault();

    const instance = axios.create({
      headers: { "Access-Control-Allow-Credentials": true }
    });
    const logInObj = { 
      username: this.state.username, 
      password: this.state.password
     };

    if (this.props.match.path === '/login') {
      const reqObj = {
          url: 'http://localhost:5000/api/login',
          method: 'post',
          data: logInObj,
          withCredentials: true
        };
      instance(reqObj)
        .then(res => {
          console.log(res);
          this.setState({ redirect: true });
        })
        .catch(error => {
          console.log("LoginForm error:",error);
          alert('Login was unsuccessful. Please try again.');
        });
    } else {
      const reqObj = {
        url: 'http://localhost:5000/api/register',
        method: 'post',
        data: logInObj,
        withCredentials: true
      };

    instance(reqObj)
      .then(() => this.setState({ redirect: true }))
      .catch(error => {
        console.log("RegisterForm error:",error);
        alert('Registration was unsuccesful. Please try again.')
      });
    }
  }

  render() {
    console.log("this.props",this.props);
    if (this.state.redirect) return <Redirect to="/users" />;
    return (
      <Form onSubmit={this.formSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          {this.inputSpitter('username')}
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          {this.inputSpitter('password', 'password')}
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

LoginForm.propTypes = {};

export default LoginForm;
