import React from 'react';
import { Row, Col, Steps } from 'antd';
import styled from 'styled-components';
import {
    BidButton
} from '../styles/styled';
import { WalletOptionsButton } from '../Wallet';

interface ApprovalStepsProps {
    current: number;
    needApprove: boolean;
    isConnected: boolean;
    onChange: (current: number) => void;
    onApprove: () => void;
    lastStepText: string;
}

const ApprovalSteps: React.FC<ApprovalStepsProps> = ({
    current,
    needApprove,
    onChange,
    onApprove,
    isConnected,
    lastStepText
}) => {
    if (isConnected && current === 0 && !needApprove) {
        return null;
    }

    if (isConnected) {
        current = 1;
    }

    return (
        <Row gutter={24}>
            <Col span={10}>
                <Steps
                    current={current}
                    onChange={onChange}
                    direction="vertical"
                    items={[
                        {
                            title: 'Step 1',
                            description: 'Connect Wallet',
                            disabled: true,
                        },
                        {
                            title: 'Step 2',
                            description: 'approve ezETH',
                            disabled: true,
                        },
                        {
                            title: 'Step 3',
                            disabled: true,
                            description: lastStepText,
                        },
                    ]}
                />
            </Col>
            <Col span={4}></Col>
            <Col
                span={5}
                style={{
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column'
                }}
            >
                <Row>
                    <WalletOptionsButton />
                </Row>
                <Row style={{ marginTop: '2rem' }}>
                    <BidButton onClick={onApprove}>Approve ezETH</BidButton>
                </Row>
            </Col>
        </Row>
    );
};

export default ApprovalSteps;
