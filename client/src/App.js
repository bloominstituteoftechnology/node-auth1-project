import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Home from './containers/Home';
import LogIn from './containers/LogIn';
import SignUp from './containers/SignUp';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #fafafa;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class App extends Component {
  render() {
    return (
      <Wrapper>
        <Switch>
          <Route
            exact
            path="/"
            render={props =>
              this.props.user ? (
                <Home />
              ) : (
                <Redirect
                  to={{ pathname: '/login', state: { from: props.location } }}
                />
              )
            }
          />
          <Route path="/login" component={LogIn} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.loggedInUser,
});

export default withRouter(connect(mapStateToProps)(App));
