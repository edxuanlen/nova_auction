import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background-color: #2a2a2a; /* 调整背景颜色 */
  width: 300px; /* 调整组件宽度 */

  margin-right: 10px;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  font-size: 16px;
  color: #fff; /* 调整文字颜色 */
  background-color: transparent; /* 使输入框背景透明 */

  &:focus {
    outline: none;
  }
`;

const MaxButton = styled.button`
  background-color: transparent; /* 使按钮背景透明 */
  border: none;
  padding: 10px;
  cursor: pointer;
  color: #888; /* 调整文字颜色 */
  font-weight: bold;

  &:hover {
    color: #fff; /* 调整悬停时候的颜色 */
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
