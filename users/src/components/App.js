import React, { Component } from 'react';
import styled from 'styled-components';
import UsersList from './usersList';

const Application = styled.div`
  
  text-align: center;

`

class App extends Component {
  render() {
    return (
      <Application>
      <h1>Users Database List</h1>
        <UsersList />
      </Application>
    );
  }
}

export default App;
