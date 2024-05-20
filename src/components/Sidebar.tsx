import React from 'react';

import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import styled from 'styled-components';

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps['items'] = [
  'Introduction',
  // 'App Guide',
  'Nova Earn',
  'Nova Auction',


].map((name, index) => ({
  key: String(index + 1),
  label: `${name}`,
}));

// console.log(items);
// if (items[1] != null) {
//   items[1]['children'] = [
//     {
//       key: '3',
//       icon: undefined,
//       label: 'Nova Earn',
//     },
//     {
//       key: '4',
//       icon: undefined,
//       label: 'Nova Auction',
//     }
//   ];
// }

type SidebarContainerProps = {
  selectedHandler: (tab: string) => void;
};

const Sidebar: React.FC<SidebarContainerProps> = ({ selectedHandler }) => {
  return (
    <Sider
      style={{ overflowY: 'hidden', height: '100%', marginTop: '16px' }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        onSelect={(event) => {
          selectedHandler(event.key);
        }}
        theme="light" mode="inline" defaultSelectedKeys={['1']} items={items} />
    </Sider>

  );
};

export default Sidebar;
