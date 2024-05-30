import React, { useEffect } from 'react';
import { Row, Col, Steps } from 'antd';
import styled from 'styled-components';
import {
    BidButton
} from '../styles/styled';
import { WalletOptionsButton } from '../Wallet';
import { getEzETHBalance } from '../utils/contract';

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

    const { Step } = Steps;

    const [showHidden, setShowHidden] = React.useState(false);

    const [title2, setTitle2] = React.useState('Step 2');
    const [title3, setTitle3] = React.useState('Step 3');

    useEffect(() => {
        if (showHidden) {
            setTitle2('Step 4');
            setTitle3('Step 5');
        }
    }, [showHidden]);

    return (
        <Row gutter={24}>
            <Col span={12}>
                <Steps
                    current={current}
                    onChange={onChange}
                    direction="vertical"
                // items={[
                //     {
                //         title: 'Step 1',
                //         description: 'Connect Wallet. currently only support arbitrium. Make sure you have ezEth in your Arbitrium account.',
                //         disabled: true,
                //         style: {
                //             cursor: 'pointer',
                //         },
                //         onClick: () => {
                //             console.log(current);
                //             if (current === 0) {

                //             }
                //         },
                //         colorTextDescription: {
                //             color: '#1890ff',
                //         },
                //     },
                //     {
                //         title: 'Step 2',
                //         description: 'approve ezETH',
                //         disabled: true,
                //     },
                //     {
                //         title: 'Step 3',
                //         disabled: true,
                //         description: lastStepText,
                //         style: {
                //             fontWeight: 'bold',
                //         }
                //     },
                // ]}
                >
                    <Step
                        title="Step 1"
                        description={
                            <>
                                <span>
                                    Connect Wallet. currently only support arbitrium. <br />
                                </span>
                                <span
                                    onClick={() => { setShowHidden(!showHidden) }}
                                    style={{ cursor: 'pointer', color: current === 1 ? '#1890ff' : 'blue' }}
                                >
                                    Make sure you have ezEth in your ARB account.
                                </span>
                            </>
                        }
                        disabled
                    />

                    {showHidden && (
                        <>
                            <Step
                                disabled
                                title="Step 2"
                                description={
                                    <>
                                        Go to <a href="https://bridge.arbitrum.io/" target="_blank" rel="noopener noreferrer"> arbitrum </a> to transfer funds to ARB network.
                                    </>
                                }
                            />
                            <Step
                                disabled
                                title="Step 3"
                                description={
                                    <>
                                        Stake your ETH and get ezETH at <a href="https://app.renzoprotocol.com/restake" target="_blank" rel="noopener noreferrer"> Renzo </a> or swap for ezETH at <a href='https://app.balancer.fi/#/ethereum/pool/0x596192bb6e41802428ac943d2f1476c1af25cc0e000000000000000000000659' target='_blank' rel='noopener noreferrer'> balancer </a>.
                                    </>
                                }
                            />
                        </>
                    )}

                    <Step
                        disabled
                        title={title2}
                        description={
                            <>
                                <span>
                                    Approve ezETH
                                </span>
                            </>
                        }
                    />

                    <Step
                        disabled
                        title={title3}
                        description={
                            <>
                                <span style={{ fontWeight: 'bold' }}>
                                    {lastStepText}
                                </span>
                            </>
                        }
                    />
                </Steps>
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
                <Row style={{ marginTop: '1.2rem' }}>
                    <WalletOptionsButton />
                </Row>
                {showHidden && (
                    <>
                        <Row style={{ marginTop: '9rem' }}>
                        </Row>
                    </>
                )}

                <Row style={{ marginTop: '2rem' }}>
                    <BidButton onClick={onApprove}>Approve ezETH</BidButton>
                </Row>
            </Col>
        </Row >
    );
};

export default ApprovalSteps;
