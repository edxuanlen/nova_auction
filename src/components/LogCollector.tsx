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
        // 重写 console.log 方法
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            this.setState((prevState) => ({
                logs: [...prevState.logs, { method: 'log', args }],
            }));
            originalConsoleLog(...args);
        };

        // 重写 console.info 方法
        const originalConsoleInfo = console.info;
        console.info = (...args) => {
            this.setState((prevState) => ({
                logs: [...prevState.logs, { method: 'info', args }],
            }));
            originalConsoleInfo(...args);
        };

        // 重写 console.warn 方法
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            this.setState((prevState) => ({
                logs: [...prevState.logs, { method: 'warn', args }],
            }));
            originalConsoleWarn(...args);
        };

        // 重写 console.error 方法
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
        // 使用 json-bigint 库序列化日志
        const serializedLogs = JSONBig.stringify(logs, null, 2);
        // 创建 Blob 对象
        const blob = new Blob([serializedLogs], { type: 'application/json' });
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        // 创建 a 标签并设置下载属性
        const link = document.createElement('a');
        link.href = url;
        link.download = 'logs.json';
        // 模拟点击下载链接
        link.click();
        // 释放 URL 对象
        URL.revokeObjectURL(url);
        // 清空日志状态
        this.setState({ logs: [] });
    };

    render() {
        return (
            <div>
                {(import.meta.env.VITE_LOG_COLLECTOR != undefined) && (
                    <FloatingButton onClick={this.handleSendLogs}>
                        <i className="fas fa-download"></i>
                        <span>DEBUG</span>
                    </FloatingButton>
                )}
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
  font-size: 12px; // 设置字体大小为 16px

  &:hover {
    background-color: #0056b3;
  }

  i {
    font-size: 24px;
  }
`;
