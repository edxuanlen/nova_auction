import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const SearchInput = styled.input`
  width: 80%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 2px;
//   margin-right: 5px;
`;

const SearchBox: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Implement search functionality as needed
  };

  return (
    // <SearchContainer>
    <SearchInput
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={handleSearchChange}
    />
    // </SearchContainer>
  );
};

export default SearchBox;
