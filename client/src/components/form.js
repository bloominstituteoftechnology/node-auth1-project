import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const StyledForm = styled.form`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

const Input = styled.input`
  padding-left: 8px;
  border: ${props => (props.match ? '1px solid green' : '1px solid #efefef')};
  outline: none;
  background-color: #fafafa;
  font-size: 12px;
  width: 100%;
  height: 38px;
  margin: 3px 0;
  color: black;
`;

const Form = ({
  username,
  password,
  password2,
  handleSubmit,
  handleChange,
  type,
  match,
}) => (
  <StyledForm onSubmit={handleSubmit}>
    <Input
      name="username"
      type="text"
      placeholder="enter username"
      value={username}
      onChange={handleChange}
      autoComplete="off"
    />
    <Input
      match={match}
      name="password"
      type="password"
      placeholder="enter password"
      value={password}
      onChange={handleChange}
      autoComplete="off"
    />
    {type === 'signUp' && (
      <Input
        match={match}
        name="password2"
        type="password"
        placeholder="re-enter password"
        value={password2}
        onChange={handleChange}
        autoComplete="off"
      />
    )}
    <Button disabled={!(username && password)} type="submit">
      Submit
    </Button>
  </StyledForm>
);

export default Form;
