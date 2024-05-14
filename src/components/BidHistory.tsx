import React, { useEffect, useState } from 'react';
import { EventInfo } from '../types';
import styled from 'styled-components';
import {
    getLogerWithWalletAddress
} from '../utils/contract';
import { etherUnits } from 'viem';

import { ethers } from 'ethers';
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
position: fixed;

  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  max-width: 90%;
  overflow-x: auto; // Ensures table is scrollable horizontally if too wide
  color: black;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

interface BidHistoryProps {
    events: EventInfo[];
    isOpen: boolean;
    filter: BigInt;
    onClose: () => void;
}

const BidHistory: React.FC<BidHistoryProps> = ({ events, isOpen, filter, onClose }) => {
    if (!isOpen) return null;

    return (
        <PopupOverlay onClick={onClose}>
            {events.length === 0 ? (
                <PopupContent>
                    <h2>Bid History</h2>
                    <p>Not Found any record</p>
                </PopupContent>
            ) : (
                <PopupContent>
                    <h2>Bid History</h2>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Point Type</th>
                                <th>Transcation Price (ezETH)</th>
                                <th>Transcation Points</th>
                                <th>Transaction Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.filter((event) => Number(event.pointType) === Number(filter))
                                .map((event, index) => (
                                    <tr key={index}>
                                        <td>{event.eventType}</td>
                                        <td>{event.pointType === 1n ? 'EzPoints' : 'ElPoints'}</td>
                                        <td>{ethers.formatEther(event.bidAmount)}</td>
                                        <td>{ethers.formatEther(event.bidPoints)}</td>
                                        <td>{event.transactionTime?.toLocaleString() || ''}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </StyledTable>
                </PopupContent>
            )}
        </PopupOverlay>
    );
};
export default BidHistory;
