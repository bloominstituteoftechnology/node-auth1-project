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
  height: 250px;
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
    password2: '',
    error: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.signingUp !== prevProps.signingUp && !this.props.signingUp) {
      this.props.history.push('/login');
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value, error: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.password === this.state.password2) {
      this.props.SignUpUser({
        username: this.state.username,
        password: this.state.password,
      });
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    return (
      <Wrapper>
        <Form
          match={
            this.state.password === this.state.password2 && this.state.password
          }
          type={'signUp'}
          username={this.state.username}
          password={this.state.password}
          password2={this.state.password2}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        {this.state.error && (
          <p style={{ color: 'red' }}>Passwords don't match</p>
        )}
        <SignUpBox>
          <p>Already Have an Account?</p>
          <Link to="/login">Log In</Link>
        </SignUpBox>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  signingUp: state.signingUp,
});

export default withRouter(
  connect(
    mapStateToProps,
    { SignUpUser },
  )(SignUp),
);
