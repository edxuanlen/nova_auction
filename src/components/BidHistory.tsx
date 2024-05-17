import React, { useEffect, useRef, useState } from 'react';
import { EventInfo } from '../types';
import styled from 'styled-components';

import ReactPaginate from 'react-paginate';

import { ethers } from 'ethers';

interface BidHistoryProps {
    events: EventInfo[];
    isOpen: boolean;
    filter: BigInt;
    onClose: () => void;
}

const itemsPerPage = 10; // Number of items to display per page

const BidHistory: React.FC<BidHistoryProps> = ({ events, isOpen, filter, onClose }) => {
    if (!isOpen) return null;


    const [currentPage, setCurrentPage] = useState(0);

    // 计算总页数
    const pageCount = Math.ceil(events.length / itemsPerPage);

    // 获取当前页的数据
    const offset = currentPage * itemsPerPage;
    const currentPageData = events.slice(offset, offset + itemsPerPage);

    // 处理页码变化
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const popupRef = useRef(null);

    const handleOverlayClick = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <PopupOverlay onClick={handleOverlayClick}>
            {events.length === 0 ? (
                <PopupContent ref={popupRef}>
                    <h2>Bid History</h2>
                    <p>Not Found any record</p>
                </PopupContent>
            ) : (
                <PopupContent ref={popupRef}>
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
                            {currentPageData.filter((event) => Number(event.pointType) === Number(filter))
                                .map((event, index) => (
                                    <tr key={index}>
                                        <td>{event.eventType}</td>
                                        <td>{event.pointType === 1n ? 'EzPoints' : 'ElPoints'}</td>
                                        <td>{Number(ethers.formatEther(event.bidPrice)).toFixed(6)}</td>
                                        <td>{Number(ethers.formatEther(event.bidPoints)).toFixed(6)}</td>
                                        <td>{event.transactionTime?.toLocaleString() || ''}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </StyledTable>
                    <PaginationContainer>
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            pageClassName={'pagination-item'}
                            activeClassName={'active'}
                            previousClassName={'pagination-item'}
                            nextClassName={'pagination-item'}
                            disabledClassName={'disabled'}
                            breakLabel={'...'}
                            breakClassName={'pagination-item'}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                        />
                    </PaginationContainer>
                </PopupContent>
            )}
        </PopupOverlay>
    );
};
export default BidHistory;

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

const PaginationContainer = styled.div`
.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.pagination-item {
  margin: 0 0.5rem;
  cursor: pointer;

  &.active {
    font-weight: bold;
  }
}
`;
