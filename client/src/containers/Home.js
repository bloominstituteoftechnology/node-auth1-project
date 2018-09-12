import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { getUsers, LogOutUser } from '../actions';
import styled from 'styled-components';
import Button from '../components/Button';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px;
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
`;
class Home extends Component {
  componentDidMount() {
    this.props.getUsers();
  }
  render() {
    return (
      <div>
        <h1>{`Welcome ${this.props.user}`}</h1>

        <Table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Password</th>
            </tr>

            {this.props.users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>&#8226; &#8226; &#8226; &#8226; &#8226; &#8226; &#8226;</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={this.props.LogOutUser}>Log Out</Button>
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
    { getUsers, LogOutUser },
  )(Home),
);
