// components/Sidebar.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

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

  &:hover {
    background: lightblue;
  }

  &.active {
    color: white;
    background: #007BFF; // 激活状态的背景色
    font-weight: bold;
  }
`;

const Sidebar = () => {
    const location = useLocation();

    const isActiveLink = (path, hash) => {
        console.log(location.pathname, location.hash);
        return location.pathname === path && location.hash === hash;
    };

    return (
        <SidebarContainer>
            <SidebarLink
                // to="/docs#introduction"
                className='active'
            >
                Introduction
            </SidebarLink>
            <SidebarLink
            // to="/docs#app-guide"
            >
                App Guide
            </SidebarLink>
        </SidebarContainer>
    );
};

export default Sidebar;
