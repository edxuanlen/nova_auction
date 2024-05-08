import React from 'react';
import styled from 'styled-components';

interface TabButtonProps {
    selected?: boolean;
    onClick: () => void;
}

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 5px;
`;

const TabButton = styled.button<TabButtonProps>`
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  background-color: ${(props) => (props.selected ? '#000000' : '#e7e7e8')};
  color: ${(props) => (props.selected ? '#ffffff' : '#000000')};
  cursor: pointer;
  width: 120px;
  height: 40px;
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

interface TabsProps {
    selectedTab: string;
    onTabClick: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ selectedTab, onTabClick }) => {
    return (
        <TabsContainer>
            <TabButton
                selected={selectedTab === 'supply'}
                onClick={() => onTabClick('supply')}
            >
                Supply
            </TabButton>
            <TabButton
                selected={selectedTab === 'withdraw'}
                onClick={() => onTabClick('withdraw')}
            >
                Withdraw
            </TabButton>
        </TabsContainer>
    );
};

import renzo from '../resources/renzo.png';
import eigenlayer from '../resources/eigenlayer.png';



const IconTabButton = styled.button<TabButtonProps>`
//   padding: 10px 20px;
  margin: 0 30px;
  border: none;
  background-color: ${(props) => (props.selected ? '#000000' : '#e7e7e8')};
  color: ${(props) => (props.selected ? '#ffffff' : '#000000')};
  cursor: pointer;
  width: 60px;
  height: 60px;
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

export const PointsTabs: React.FC<TabsProps> = ({ selectedTab, onTabClick }) => {
    return (
        <TabsContainer>
            <IconTabButton
                selected={selectedTab === 'EzPoints'}
                onClick={() => onTabClick('EzPoints')}
            >
                <img src={renzo} alt="renzo" style={{ width: '40px', height: '40px' }} /> Points
            </IconTabButton>
            <IconTabButton
                selected={selectedTab === 'ElPoints'}
                onClick={() => onTabClick('ElPoints')}
            >
                <img src={eigenlayer} alt="renzo" style={{ width: '40px', height: '40px' }} /> Points
            </IconTabButton>
        </TabsContainer>
    );
};

export default Tabs;
