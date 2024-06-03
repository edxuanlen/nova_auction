import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background-color: #2a2a2a;
  width: 300px;

  margin-right: 10px;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: transparent;

  &:focus {
    outline: none;
  }
`;

const MaxButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  color: #888;
  font-weight: bold;

  &:hover {
    color: #fff;
  }
`;

const InputWithMax = ({ value, onChange, onMax }) => {
  return (
    <Container>
      <StyledInput type="number"
        value={value}
        onChange={onChange}
        placeholder="Enter amount" />

      <MaxButton onClick={onMax}>MAX</MaxButton>
    </Container>
  );
};

export default InputWithMax;
