import { useState, useEffect } from 'react';

import styled from 'styled-components';
import logo from './resources/logo.png';


import { WalletOptionsButton } from './Wallet'

import { LogCollector, BlockTimestampSync } from './components';

import './components/EventWatcher';

import { Route, Routes, Navigate, useNavigate, useLocation, useRouteLoaderData } from 'react-router-dom';

import { getCookieByKey, setCookie } from './utils/cookie';

import EarnPage from './pages/EarnPage';
import DocsPage from './pages/DocsPage';
import AuctionPage from './pages/AuctionPage';
import BackendPage from './pages/BackendPage';

import { watchAccount } from '@wagmi/core'

import { useAccountEffect, useAccount } from 'wagmi'
import { clearDB } from './utils/contract';
import { ADMIN_ADDRESS, config } from './config'
import React from 'react';

import { FaTwitter, FaGithub, FaTelegram, FaDiscord, FaWindows } from 'react-icons/fa';
import ReactGA from 'react-ga4';
import TVLShower from './components/TVLShower';


const ProtectedRoute: React.FC<{ children: JSX.Element; show: Boolean }> = ({ children, show }) => {
  if (show) {
    return children;
  }
  else {
    return <Navigate to="/" replace />;
  }
};

const NovaPage = () => {

  const [activeTab, setActiveTab] = useState('docs');

  const { address } = useAccount();

  const isAdmin = (address != undefined) && (ADMIN_ADDRESS.includes(address.toLowerCase()));

  const navigate = useNavigate();

  const routePaths = [
    'docs',
    'earn',
    'auction',
    'admin'
  ]

  useEffect(() => {
    // let selectedTab = getSelectedTab();

    const pathname = location.pathname.split('/')[1];
    if (routePaths.includes(pathname)) {
      setActiveTab(pathname);
    } else {
      setActiveTab('docs');
      navigate(`/docs`);
    }
  }, []);

  watchAccount(config, {
    onChange: (account) => {

      if (account.address == undefined) {
        return;
      }

      const key = 'lastaccount';
      const lastAccount = getCookieByKey(key);
      if (lastAccount == undefined) {
        setCookie(key, account.address);
      }
      else if (lastAccount != account.address) {
        clearDB();
        setCookie(key, account.address);
        window.location.reload();
      }
    }
  });

  useAccountEffect({
    onDisconnect() {
      console.log('Disconnected!')
      clearDB();
      window.location.reload();
    },
  });

  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('G-YSRG1RRMQZ');
    ReactGA.send("pageview");
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

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
            window.open('https://discord.gg/h6J7cFSRun', '_blank');
          }} style={{ marginRight: '0.5rem', cursor: 'pointer' }}
          />
        </div>
        <WalletContaioner>
          <WalletOptionsButton />
        </WalletContaioner>

        {isAdmin &&
          (<BidHistoryButton onClick={() => (navigate("/admin"))}>Go to Backend</BidHistoryButton>)
        }

      </Header>

      <Routes>

        <Route path="/" element={<Navigate to="/docs" replace />} />
        <Route path="" element={<Navigate to="/docs" replace />} />
        <Route path='admin' Component={BackendPage} />

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
      {/* <BidButtonContainer> */}
      <TVLShower />
      {/* </BidButtonContainer> */}
    </Container >

  );
};

const WalletContaioner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5%;
`;

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


const BidHistoryButton = styled.button`
  display: flex;
  flex-direction: row;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-right: 5rem;

  &:hover {
    background-color: #495057;
  }

`;

export default NovaPage;
