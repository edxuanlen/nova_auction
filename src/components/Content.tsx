import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Content: React.FC = () => {
    const { section, page } = useParams<{ section: string; page: string }>();
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await fetch(`/docs/${section}/${page}.md`);
                const text = await response.text();
                setMarkdown(text);
            } catch (error) {
                setMarkdown('Error loading content.');
            }
        };

        fetchMarkdown();
    }, [section, page]);

    return (
        <ContentContainer>
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </ContentContainer>
    );
};

export default Content;
