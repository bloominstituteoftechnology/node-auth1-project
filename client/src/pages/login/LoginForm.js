import React from 'react';
import PropTypes from 'prop-types';
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
      value={[`this.state.${name}`]} 
      onChange={handler}
    />;
  }

  formSubmit() {
    const logInObj = { 
      username: this.state.username, 
      password: this.state.password
     };

    if (this.props.match.path === '/login') {
      axios.post('http://localhost:5000/api/register', logInObj)
        .then(authKey => {
          console.log(authKey);
          this.setState({ redirect: true });
        })
        .catch(error => console.log(err.message));
    } else {

    }
  }

  render() {
    if (this.state.redirect) return <Redirect to="/" />;
    return (
      <Form onSubmit={this.formSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          {inputSpitter('username')}
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          {inputSpitter('password', 'password')}
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

LoginForm.propTypes = {};

export default LoginForm;
