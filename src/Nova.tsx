import { useState, useEffect } from 'react';

import styled from 'styled-components';
import logo from './resources/logo.png';


import { WalletOptionsButton } from './Wallet'

import { LogCollector, BlockTimestampSync } from './components';

import './components/EventWatcher';

import { BrowserRouter as Router, Route, Link, Routes, Navigate, useNavigate } from 'react-router-dom';

// import { contract, ezContract, tokenContract } from './utils/contract';

import EarnPage from './pages/EarnPage';
import DocsPage from './pages/DocsPage';
import AuctionPage from './pages/AuctionPage';

import { useAccountEffect } from 'wagmi'
import { clearDB } from './utils/contract';
import React from 'react';

import { FaTwitter, FaGithub, FaTelegram, FaDiscord } from 'react-icons/fa';


const NovaPage = () => {

  const [activeTab, setActiveTab] = useState('docs');

  // const isAdmin = (address != undefined) && (ADMIN_ADDRESS.includes(address.toLowerCase()));

  const navigate = useNavigate();

  useEffect(() => {
    // let selectedTab = getSelectedTab();

    const pathname = location.pathname.split('/')[1];
    if (pathname === 'earn' || pathname === 'auction' || pathname === 'docs') {
      setActiveTab(pathname);
    } else {
      setActiveTab('earn');
      navigate(`/earn`);
    }
  }, []);


  useAccountEffect({
    onDisconnect() {
      console.log('Disconnected!')
      clearDB();
    },
  });

  return (
    <Container>
      <Header>
        <LogoLink href="/">
          <LogoImage src={logo} alt="Logo" />
        </LogoLink>
        <TabContainer>
          <Tab
            active={activeTab === 'docs' ? 'true' : 'false'}
            onClick={() => {
              setActiveTab('docs');
              navigate('/docs');
            }}>
            Docs
          </Tab>
          <Tab
            active={activeTab === 'earn' ? 'true' : 'false'}
            onClick={() => {
              setActiveTab('earn');
              navigate('/earn');
            }}>
            Earn
          </Tab>
          <Tab
            active={activeTab === 'auction' ? 'true' : 'false'}
            onClick={() => {
              setActiveTab('auction');
              navigate('/auction');
            }}>
            Auction
          </Tab>
        </TabContainer>
        <div>
          {/* <FaTwitter size={20} style={{ marginRight: 'rem' }} />
          <FaGithub size={20} style={{ marginRight: '0.5rem' }} />
          <FaTelegram size={20} style={{ marginRight: '0.5rem' }} /> */}
          <FaDiscord size={20} onClick={() => {
            window.open('https://discord.com/invite/ra5T3JfU', '_blank');
          }} style={{ marginRight: '0.5rem' }} style={{ marginRight: '0.5rem', cursor: 'pointer' }}
          />
        </div>
        <WalletOptionsButton />

        {/* {isAdmin &&
              (<BidHistoryButton onClick={() => (navigate("/admin"))}>Go to Backend</BidHistoryButton>)
            } */}

      </Header>

      <Routes>

        <Route path="/" element={<Navigate to="/docs" replace />} />
        <Route path="" element={<Navigate to="/docs" replace />} />
        {/* <Route path="/earn" Component={EarnPage} />
        <Route path="/auction" Component={AuctionPage} /> */}

        {activeTab === 'docs' && (
          <Route path="/docs" Component={DocsPage} />
        )}
        {activeTab === 'earn' && (
          <Route path="/earn" Component={EarnPage} />
        )}
        {activeTab === 'auction' && (
          <Route path="/auction" Component={AuctionPage} />
        )}
      </Routes>
      {(import.meta.env.VITE_LOG_COLLECTOR != undefined) && (
        <LogCollector />
      )}
      <BlockTimestampSync />
    </Container >
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding: 2rem;
  background-color: #1a1a1a;
  color: #fff;
  width: 100%;
  height: 300px;

`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #000000;

  top: 0;
  padding: 2rem 0rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2rem;
`;

const Tab = styled.div`
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  cursor: pointer;
  color: ${props => props.active === 'true' ? '#ffffff' : '#a0a0a0'};
  border-bottom: ${props => props.active === 'true' ? '2px solid #ffffff' : 'none'};

  /* 为 Tab 组件添加鼠标悬停效果,提高交互体验 */
  transition: color 0.3s ease;

  &:hover {
    color: #ffffff;
  }
`;

const LogoLink = styled.a`
  display: inline-block;
  margin-right: 5%;
    font-size: 1.5rem;
//   font-weight: bold;
   margin-left: 17%;
`;

const LogoImage = styled.img`
  height: 30px;
`;

export default NovaPage;
