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
  border: ${props => (props.err ? '2px solid red' : '1px solid #efefef')};
  outline: none;
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

const Form = ({
  username,
  password,
  password2,
  handleSubmit,
  handleChange,
  type,
  error,
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
      err={error}
      name="password"
      type="password"
      placeholder="enter password"
      value={password}
      onChange={handleChange}
      autoComplete="off"
    />
    {type === 'signUp' && (
      <Input
        err={error}
        name="password2"
        type="password"
        placeholder="re-enter password"
        value={password2}
        onChange={handleChange}
        autoComplete="off"
      />
    )}
    <Button type="submit">Submit</Button>
  </StyledForm>
);

export default Form;
