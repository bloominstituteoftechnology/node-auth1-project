import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import UserAuth from "./components/UserAuth";
import { Route, withRouter } from "react-router-dom";
const GlobalStyles = createGlobalStyle`

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  box-sizing: border-box;

}`;

class App extends Component {
  render() {
    return (
      <>
        <GlobalStyles />

        <h1>yo man</h1>
        <Route exact path="/login" render={props => <UserAuth {...props} />} />
      </>
    );
  }
}

export default withRouter(App);
