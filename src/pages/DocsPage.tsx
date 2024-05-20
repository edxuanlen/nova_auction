import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
// import Content from '../components/Content';
import SearchBox from '../components/SearchBox';
import { Layout, Menu, theme } from 'antd';
import Markdown from 'react-markdown';
import * as remark from 'remark';
import fs from 'fs';


import remarkGfm from 'remark-gfm';

// declare module '*.md';
// import Introduction from '../docs/1.md';
// import NovaEarn from '../docs/3.md';
// import NovaAuction from '../docs/4.md';

// const docsMap = new Map<string, string>([
//   ['1', Introduction],
//   ['3', NovaEarn],
//   ['4', NovaAuction],
// ]);


const { Header, Content, Footer, Sider } = Layout;

const DocsPageContainer = styled.div`
  position: fixed;
  top: 100px; // 根据 Header 的高度设置 top 值
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  overflow-y: auto; // 添加垂直滚动条
`;



const SidebarContainer = styled.div`
  width: 250px;
  background: #f0f0f0;
  padding: 20px;
  height: 20%;
`;

// const processor = remark().use(remarkGfm);


const DocsPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedTab, setSelectedTab] = React.useState('1');
  const [content, setContent] = React.useState('');


  return (
    <DocsPageContainer>
      <SidebarContainer>
        {/* <SearchBox /> */}
        <Sidebar selectedHandler={function (tab: string): void {
          console.log("tab: ", tab);
          setSelectedTab(tab);

          const filename = 'http://localhost:8000/' + selectedTab + '.md';

          fetch(filename).then((response) => response.text()).then((text) => {
            setContent(text);
          })

        }} />
      </SidebarContainer>
      {/* <Main>
        <Routes>
          <Route path="/:section/:page" element={<Content />} />
          <Route path="*" element={<Content />} />
        </Routes>
      </Main> */}


      <Layout style={{}}>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content style={{ overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >

            <Markdown
              className="markdown"
              remarkPlugins={[remarkGfm]}
            // children={selectedTab}
            >
              {content}


            </Markdown>

            {/* <p>long content</p>
            {
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? 'more' : '...'}
                  <br />
                </React.Fragment>
              ))
            } */}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </DocsPageContainer>
  );
};

export default DocsPage;
