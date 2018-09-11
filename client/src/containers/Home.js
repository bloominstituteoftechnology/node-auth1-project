import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { getUsers } from '../actions';
import styled from 'styled-components';

class Home extends Component {
  componentDidMount() {
    this.props.getUsers();
  }
  render() {
    return (
      <div>
        <p>{`Welcome ${this.props.user}`}</p>
        {this.props.users.map(user => (
          <p>{`${user.id}, ${user.username}`}</p>
        ))}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  users: state.users,
  user: state.loggedInUser,
});

export default withRouter(
  connect(
    mapStateToProps,
    { getUsers },
  )(Home),
);
