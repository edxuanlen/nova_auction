import React, { Component } from 'react';
import axios from 'axios';
import JSONBig from 'json-bigint';
import styled from 'styled-components';

export class LogCollector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
        };
    }

    componentDidMount() {
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            this.setState((prevState) => ({
                logs: [...prevState.logs, { method: 'log', args }],
            }));
            originalConsoleLog(...args);
        };

        const originalConsoleInfo = console.info;
        console.info = (...args) => {
            this.setState((prevState) => ({
                logs: [...prevState.logs, { method: 'info', args }],
            }));
            originalConsoleInfo(...args);
        };

        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            this.setState((prevState) => ({
                logs: [...prevState.logs, { method: 'warn', args }],
            }));
            originalConsoleWarn(...args);
        };

        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.setState((prevState) => ({
                logs: [...prevState.logs, { method: 'error', args }],
            }));
            originalConsoleError(...args);
        };
    }

    handleSendLogs = () => {
        const { logs } = this.state;
        const serializedLogs = JSONBig.stringify(logs, null, 2);
        const blob = new Blob([serializedLogs], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'logs.json';
        link.click();
        URL.revokeObjectURL(url);
        this.setState({ logs: [] });
    };

    render() {
        return (
            <div>
                <FloatingButton onClick={this.handleSendLogs}>
                    <i className="fas fa-download"></i>
                    <span>DEBUG</span>
                </FloatingButton>
            </div>
        );
    }
}

const FloatingButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  transition: background-color 0.3s ease;
  font-size: 12px;

  &:hover {
    background-color: #0056b3;
  }

  i {
    font-size: 24px;
  }
`;
