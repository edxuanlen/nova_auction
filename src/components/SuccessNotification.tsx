import React, { useEffect } from 'react';
import styled from 'styled-components';
import { EventInfo } from '../types';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
const SuccessMessage = styled.div`
  color: #2e7d32;
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;
`;

interface SuccessNotificationProps {
    lastBid: EventInfo | undefined;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ lastBid }) => {
    if (!lastBid) {
        return null;
    }

    return (
        <SuccessMessage>
            Auction bid placed successfully! Waiting for the auction to end.
            <br />
            Recent bid: {ethers.formatEther(lastBid.bidPoints.toString())} points at {ethers.formatEther(lastBid.bidPrice.toString())} ezETH per point.
        </SuccessMessage>
    );
};

export default SuccessNotification;
