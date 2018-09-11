import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import Form from '../components/form';
import { LogInUser } from '../actions';
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

class LogIn extends Component {
  state = {
    username: '',
    password: '',
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.LogInUser(this.state);
  };

  render() {
    if (this.props.user) {
      return <Redirect to="/" />;
    }
    return (
      <Wrapper>
        <Form
          username={this.state.username}
          password={this.state.password}
          handleChange={e => this.setState({ [e.target.name]: e.target.value })}
          handleSubmit={this.handleSubmit}
        />
        <SignUpBox>
          <p>Don't have an account?</p>
          <Link to="/signup">Sign Up</Link>
        </SignUpBox>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.loggedInUser,
});

export default withRouter(
  connect(
    mapStateToProps,
    { LogInUser },
  )(LogIn),
);
