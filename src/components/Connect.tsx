import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import walletConnect from '../resources/walletConnect.png';
import coinbaseIcon from '../resources/coinbase.png';
import metamaskIcon from '../resources/metamask.png';

import { Connector, useChainId, useConnect, useAccount, useDisconnect } from 'wagmi';
import { Modal, Button, List } from 'antd';

export function Connect() {
    const chainId = useChainId();
    const { connectors, connect } = useConnect();

    return (
        <div className="buttons">
            {connectors.map((connector) => (
                <WalletConnectComponent
                    key={connector.uid}
                    connector={connector}
                    onClick={() => connect({ connector, chainId })}
                />
            ))}
        </div>
    );
}

export function WalletConnectComponent({
    connector,
    onClick,
}: {
    connector: Connector;
    onClick: () => void;
}) {
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
        (async () => {
            const provider = await connector.getProvider();
            setReady(!!provider);

        })();
    }, [connector, setReady]);

    return (
        <button
            className="button"
            disabled={!ready}
            onClick={onClick}
            type="button"
        >
            {connector.name}
        </button>
    );
}

// key is name, value is icon
const wallet2icon: Record<string, string> = {
    // 'OKX Wallet': '/path/to/okx-icon.png',
    // 'Ronin Wallet': '/path/to/ronin-icon.png',
    // 'Browser Wallet': '/path/to/browser-icon.png',
    // 'GateWallet': '/path/to/gate-icon.png',
    // 'Binance Web3 Wallet': '/path/to/binance-icon.png',
    'MetaMask': metamaskIcon,
    "Coinbase Wallet": coinbaseIcon,
    'WalletConnect': walletConnect,
};

// if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
//     console.log('MetaMask is installed!');
// }


export function WalletOptions() {
    const { connectors, connect } = useConnect();
    const { isConnected, status, address } = useAccount();
    const { disconnect } = useDisconnect();
    const [open, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleConnect = (connector: Connector) => {
        connect({ connector });
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const handleDisconnect = () => {
        // connect({ connector: connectors[0] });
        // setVisible(false);
        disconnect();
    };

    for (const connector of connectors) {
        console.log("connector: ", connector.name);
        console.log(connector);
        const provider = connector.getProvider();
        // cons
        console.log(provider);

    }


    return (
        <>
            {(isConnected === false) && (
                <ConnectWalletButton type="primary" onClick={showModal}>
                    Connect Wallet
                </ConnectWalletButton>
            )}
            {(isConnected === true) && (
                <ConnectWalletButton
                    type="primary"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleDisconnect}
                >
                    {hovered ? 'Disconnect' : address}
                </ConnectWalletButton >

            )}

            <Modal
                title="Select Wallet"
                open={open}
                onCancel={handleCancel}
                footer={null}
            >
                <List
                    dataSource={Array.from(connectors)}
                    renderItem={(connector) => (
                        (connector.name in wallet2icon) ? (
                            <List.Item
                                key={connector.uid}
                                onClick={() => handleConnect(connector)}
                                style={{ cursor: 'pointer' }}
                            >

                                <WalletIcon src={wallet2icon[connector.name]} />
                                {connector.name}
                            </List.Item>
                        ) : (connector.icon) ? (
                            <List.Item
                                key={connector.uid}
                                onClick={() => handleConnect(connector)}
                                style={{ cursor: 'pointer' }}
                            >

                                <WalletIcon src={connector.icon} />
                                {connector.name}
                            </List.Item>) : null)
                    }
                />
            </Modal>
        </>
    );
}

const WalletIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;

const ConnectWalletButton = styled.button`
  display: block; /* 块级元素支持宽度和溢出设置 */

  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 15%;

  //   调整 ConnectWalletButton 组件的样式,使其更加醒目
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  background-color: #2196f3;
  transition: background-color 0.3s ease;

  &:hover {
      background-color: #1976d2;
    }

  width: 10%; /* 根据需要设置按钮的固定宽度 */
  overflow: hidden; /* 隐藏溢出的文本 */
  text-overflow: ellipsis; /* 设置溢出文本显示省略号 */
  white-space: nowrap; /* 防止文本换行 */

`;
