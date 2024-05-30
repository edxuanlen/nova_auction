// AprCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';

const StyledCard = styled(Card)`
  width: 300px;
  height: 120px;
  display: flex;
  align-items: center;
  flex-direction: row;
  // padding: 16px;
  background: linear-gradient(to right, #2c3e50, #4ca1af);
  border-radius: 12px;
  // border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
`;

const Yield = styled.div`
  color: #42c8f5;
  font-size: 1.5rem;
  font-weight: bold;
`;

const SubTitle = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
`;

interface CardComponentProps {
  logoSrc: string;
  title: string;
  yieldValue: string;
  subTitle: string;
}

const AprCard: React.FC<CardComponentProps> = ({ logoSrc, title, yieldValue, subTitle }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '15vh',
      // width: '30%',
    }}>
      <StyledCard
        style={{ width: "100%", flexDirection: 'row' }}>
        {/* <Logo src={logoSrc} alt="logo" /> */}
        <Content>
          <Title>{title}</Title>
          <Yield>{yieldValue}% <span style={{ fontSize: '0.8rem' }}>{subTitle}</span></Yield>
        </Content>
      </StyledCard>
    </div>
  );
};

export default AprCard;
