import React from 'react';
import { Row, Col, Steps } from 'antd';
import styled from 'styled-components';
import {
    BidButton
} from '../styles/styled';

interface ApprovalStepsProps {
    current: number;
    needApprove: boolean;
    onChange: (current: number) => void;
    onApprove: () => void;
}

const ApprovalSteps: React.FC<ApprovalStepsProps> = ({
    current,
    needApprove,
    onChange,
    onApprove,
}) => {
    if (current === 0 && !needApprove) {
        return null;
    }

    return (
        <Row gutter={24}>
            <Col span={6}>
                <Steps
                    current={current}
                    onChange={onChange}
                    direction="vertical"
                    items={[
                        {
                            title: 'Step 1',
                            description: 'approve ezETH',
                            disabled: true,
                        },
                        {
                            title: 'Step 2',
                            disabled: true,
                        },
                    ]}
                />
            </Col>
            <Col span={8}></Col>
            <Col
                span={5}
                style={{
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <BidButton onClick={onApprove}>Approve ezETH</BidButton>
            </Col>
        </Row>
    );
};

export default ApprovalSteps;
