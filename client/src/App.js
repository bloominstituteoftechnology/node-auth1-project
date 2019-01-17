import React, { Component } from "react";
import Login from "./components/Login";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-family: "Press Start 2P", cursive;
  font-size: 72px;
  margin: 20px 0px;
`;

class App extends Component {
  render() {
    return (
      <div>
        <Title>Auth-I</Title>
        <Login />
      </div>
    );
  }
}

export default withRouter(App);
