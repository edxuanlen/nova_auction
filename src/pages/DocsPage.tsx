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

import { marked as markedParser } from 'marked';

const MarkdownComponent = ({ markdownText }: { markdownText: string }) => {
    const renderer = new markedParser.Renderer();

    // 原始的图片渲染函数
    const originalRendererImage = renderer.image;
    renderer.image = (href, title, text) => {
        // 可以在这里修改href，例如加上基础路径
        href = `${href}`;
        return originalRendererImage.call(renderer, href, title, text);
    };

    markedParser.setOptions({
        renderer
    });

    const getMarkdownText = () => {
        const rawMarkup = markedParser(markdownText);
        return { __html: rawMarkup };
    };

    return <div
        dangerouslySetInnerHTML={getMarkdownText()}
        style={{ marginLeft: '10rem', color: '#000', width: '60%' }}
    />;
};

import { NovaEarnMD, IntroductionMD, NovaAuctionMD } from '../docs/init';

const docsMap = new Map<string, any>([
    ['1', IntroductionMD],
    ['2', NovaEarnMD],
    ['3', NovaAuctionMD],
]);


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
  background: #ffffff;
  padding: 20px;
  height: 30%;
`;


const DocsPage = () => {

    const [content, setContent] = React.useState(IntroductionMD);


    return (
        <DocsPageContainer>
            <SidebarContainer>
                <Sidebar selectedHandler={function (tab: string): void {
                    console.log("tab: ", tab);
                    setContent(docsMap.get(tab));
                }} />
            </SidebarContainer>

            <Layout style={{ backgroundColor: '#ffffff', width: '60%' }}>
                <MarkdownComponent
                    markdownText={content}
                ></MarkdownComponent>
                <Footer style={{ textAlign: 'center', backgroundColor: "#ffffff", width: '80%' }}>
                    Nova Auction ©2024 Created by
                </Footer>
            </Layout>
        </DocsPageContainer >
    );
};

export default DocsPage;
