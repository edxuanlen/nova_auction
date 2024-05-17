import styled from "styled-components";

interface TabButtonProps {
    selected?: boolean;
}

const TabButton = styled.button<TabButtonProps>`
    padding: 10px 20px;
    margin: 0 5px;
    border: none;
    background-color: ${(props) => (props.selected ? '#000000' : '#e7e7e8')};
    color: ${(props) => (props.selected ? '#ffffff' : '#000000')};
    cursor: pointer;
    width: 120px; // Set a fixed width
    height: 40px; // Set a fixed height if necessary
    box-sizing: border-box;
    border-radius: 5px;

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: ${(props) => (props.selected ? '#000000' : '#333333')};
      color: #ffffff;
    }
`;

export default TabButton;
