import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Form from '../components/form';
import { SignUpUser } from '../actions';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: white;
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #e6e6e6;
  height: 200px;
`;

const SignUpBox = styled.div`
  padding: 5px;
  display: flex;

  p {
    padding: 0 5px;
  }
`;

class SignUp extends Component {
  state = {
    username: '',
    password: '',
  };

  render() {
    return (
      <Wrapper>
        <Form
          username={this.state.username}
          password={this.state.password}
          handleChange={e => this.setState({ [e.target.name]: e.target.value })}
          handleSubmit={e => {
            e.preventDefault();
            this.props.SignUpUser(this.state);
            this.props.history.push('/login');
          }}
        />
        <SignUpBox>
          <p>Already Have an Account?</p>
          <Link to="/login">Log In</Link>
        </SignUpBox>
      </Wrapper>
    );
  }
}

export default withRouter(
  connect(
    null,
    { SignUpUser },
  )(SignUp),
);
