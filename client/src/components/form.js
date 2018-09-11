import React from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  width: 80%;
  ${'' /* height: 80%; */} display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

const Input = styled.input`
  padding-left: 8px;
  outline: none;
  border: 1px solid #efefef;
  background-color: #fafafa;
  font-size: 12px;
  width: 100%;
  height: 38px;
  margin: 3px 0;
  color: black;
`;

const Button = styled.button`
  outline: none;
  font-size: 14px;
  background-color: rgb(56, 151, 240);
  border-radius: 3px;
  padding: 0 12px;
  color: #fff;
  font-weight: bold;
  width: 100%;
  line-height: 26px;

  &:disabled {
    opacity: 0.3;
  }
  &:focus {
    outline: none;
  }
`;

const Form = ({ username, password, handleSubmit, handleChange }) => (
  <StyledForm onSubmit={handleSubmit}>
    <Input
      name="username"
      type="text"
      placeholder="enter username"
      value={username}
      onChange={handleChange}
    />
    <Input
      name="password"
      type="text"
      placeholder="enter password"
      value={password}
      onChange={handleChange}
    />
    <Button type="submit">Submit</Button>
  </StyledForm>
);

export default Form;
