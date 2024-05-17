import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';

const DocsPageContainer = styled.div`
  position: fixed;
  top: 100px; // 根据 Header 的高度设置 top 值
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  overflow-y: auto; // 添加垂直滚动条
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;


const SidebarContainer = styled.div`
  width: 250px;
  background: #f0f0f0;
  padding: 20px;
`;

const SidebarLink = styled.div`
  display: block;
  padding: 10px;
  color: black;
  text-decoration: none;
  background: #f0f0f0; // 默认背景色

  &:hover, &:focus {
    background: lightblue;
    cursor: pointer;  // 添加在 hover 和 focus 时的 cursor 样式
  }

  &.active {
    color: white;
    background: #007BFF; // 激活状态的背景色
    font-weight: bold;
  }
`;


const DocsPage = () => {

    const [activeLink, setActiveLink] = React.useState('');

    return (
        <DocsPageContainer>


            <SidebarContainer>
                <SidebarLink
                    onClick={() => setActiveLink('introduction')}
                    className={activeLink === 'introduction' ? 'active' : ''}
                >
                    Introduction
                </SidebarLink>
                <SidebarLink
                    onClick={() => setActiveLink('app-guide')}
                    className={activeLink === 'app-guide' ? 'active' : ''}
                >
                    App Guide
                </SidebarLink>
            </SidebarContainer>

            <ContentArea>
                {activeLink === 'introduction' && <Content markdown="# Introduction  Here is some introduction content. </br>" />}
                {activeLink === 'app-guide' && <Content markdown="# App Guide  Here is some app guide content. </br>" />}
            </ContentArea>
        </DocsPageContainer>
    );
};

export default DocsPage;
