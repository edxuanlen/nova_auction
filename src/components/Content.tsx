// components/Content.js
import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const ContentContainer = styled.div`
  overflow-y: auto;
  height: calc(100vh - 40px);  // Adjust height as needed
  color: #333;
`;

const Content = ({ markdown }) => {
    return (
        <ContentContainer>
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </ContentContainer>
    );
};

export default Content;
