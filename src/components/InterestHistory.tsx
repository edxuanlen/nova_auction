import React, { useEffect, useState } from 'react';
import { EarningInfo } from '../types';
import styled from 'styled-components';
import { formatDate } from '../utils/time';

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

interface InterestHistoryProps {
    infos: EarningInfo[];
    isOpen: boolean;
    onClose: () => void;
}

const InterestHistory: React.FC<InterestHistoryProps> = ({ infos, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <PopupOverlay onClick={onClose}>
            {infos.length === 0 ? (
                <PopupContent>
                    <h2>Earning Record</h2>
                    <p>Not Found any record</p>
                </PopupContent>
            ) : (
                <PopupContent>
                    <h2>Earning Record</h2>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Interest income(ezETH)</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {infos.map((info, index) => (
                                <tr key={index}>
                                    <td>{info.EarnAmount.toFixed(6)}</td>
                                    <td>{formatDate(info.EarnTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </PopupContent>
            )}
        </PopupOverlay>
    );
};
export default InterestHistory;
