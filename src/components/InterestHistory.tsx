import React, { useEffect, useRef, useState } from 'react';
import { EarningInfo } from '../types';
import styled from 'styled-components';
import { formatDate } from '../utils/time';
import ReactPaginate from 'react-paginate';


interface InterestHistoryProps {
    infos: EarningInfo[];
    isOpen: boolean;
    onClose: () => void;
}
const itemsPerPage = 10; // Number of items to display per page

const InterestHistory: React.FC<InterestHistoryProps> = ({ infos, isOpen, onClose }) => {
    if (!isOpen) return null;

    const [currentPage, setCurrentPage] = useState(0);

    let currentPageData = [];
    let handlePageClick;
    let pageCount = 0;
    if (infos != undefined) {
        pageCount = Math.ceil(infos.length / itemsPerPage);

        const offset = currentPage * itemsPerPage;
        currentPageData = infos.slice(offset, offset + itemsPerPage);

        handlePageClick = ({ selected }) => {
            setCurrentPage(selected);
        };
    }

    const popupRef = useRef(null);

    const handleOverlayClick = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <PopupOverlay onClick={handleOverlayClick}>
            {infos == undefined || infos.length === 0 ? (
                <PopupContent ref={popupRef}>
                    <h2>Earning Record</h2>
                    <p>Not Found any record</p>
                </PopupContent>
            ) : (
                <PopupContent ref={popupRef}>
                    <h2>Earning Record</h2>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Interest income(ezETH)</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((info, index) => (
                                <tr key={index}>
                                    <td>{info.EarnAmount.toFixed(6)}</td>
                                    <td>{formatDate(info.EarnTime)}</td>
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
export default InterestHistory;

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
