import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  outline: none;
  font-size: 14px;
  background-color: rgb(56, 151, 240);
  border-radius: 3px;
  padding: 0 12px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  line-height: 26px;

  &:disabled {
    opacity: 0.3;
  }
  &:focus {
    outline: none;
  }
`;

const Button = ({ disabled, type, children, handleClick }) => (
  <StyledButton disabled={disabled} type={type} onClick={handleClick}>
    {children}
  </StyledButton>
);

export default Button;
