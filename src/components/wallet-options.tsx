import React, { useState } from 'react';
import { Connector, useConnect } from 'wagmi';
import { Modal, Button, List } from 'antd';

export function WalletOptions() {
    const { connectors, connect } = useConnect();
    const [visible, setVisible] = useState(false);

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

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Connect Wallet
            </Button>
            <Modal
                title="Select Wallet"
                visible={visible}
                onCancel={handleCancel}
                footer={null}
            >
                <List
                    dataSource={Array.from(connectors)}
                    renderItem={(connector) => (
                        <List.Item
                            key={connector.uid}
                            onClick={() => handleConnect(connector)}
                            style={{ cursor: 'pointer' }}
                        >
                            {connector.name}
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
}
