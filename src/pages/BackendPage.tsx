import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { ADMIN_ADDRESS } from '../config';
// import {}
import { useAccount, } from 'wagmi';
import { Table, ColumnsType } from 'antd';
import { AuctionInfo, AuctionType } from '../types';
import { createAuction } from '../utils/contract';

const Button = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background-color: #28a745;
  color: #ffffff;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const AllAuctionsContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const AuctionItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  &:last-child {
    border-bottom: none;
  }
`;

const AuctionLabel = styled.p`
  font-weight: bold;
`;

const AuctionDetail = styled.p`
  margin: 0;
`;

const StyledButton = styled(Button)`
  background-color: #3498db;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    background-color: #1c5a83;
  }
`;

interface AllAuctionsProps {
  auctions: AuctionInfo[];
  handleDelete: (index: number) => void;
}

const AllAuctions: React.FC<AllAuctionsProps> = ({ auctions, handleDelete }) => {
  return (
    <AllAuctionsContainer>
      <h2>All Auctions</h2>
      {auctions.map((auction, index) => (
        <AuctionItem key={index}>
          <AuctionLabel>Start Time:</AuctionLabel>
          <AuctionDetail>{auction.startTime.toISOString()}</AuctionDetail>

          <AuctionLabel>End Time:</AuctionLabel>
          <AuctionDetail>{auction.endTime.toISOString()}</AuctionDetail>

          <AuctionLabel>Points Type:</AuctionLabel>
          <AuctionDetail>{auction.pointsType}</AuctionDetail>

          <AuctionLabel>Points Quantity:</AuctionLabel>
          <AuctionDetail>{auction.pointsQuantity}</AuctionDetail>

          <AuctionLabel>Starting Bid:</AuctionLabel>
          <AuctionDetail>{auction.startingBid}</AuctionDetail>

          <StyledButton onClick={() => handleDelete(index)}>Delete</StyledButton>
        </AuctionItem>
      ))}
    </AllAuctionsContainer>
  );
};


const FormContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #000000;
  width: 100%;
  margin: 20px auto;
`;

const PointsSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
`;


const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    background-color: #1c5a83;
  }
`;
interface AuctionFormProps {
  handleSubmit: () => void;
  newAuction: AuctionInfo;
  handleAuctionChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AuctionForm: React.FC<AuctionFormProps> = ({ handleSubmit, newAuction, handleAuctionChange }) => {
  return (
    <FormContainer>
      <h2>Create a New Auction</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}

      >
        <Label>
          Start Time:
          <Input
            type="datetime-local"
            name="startTime"
            value={newAuction.startTime.toLocaleString('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).replace(', ', 'T').substring(0, 16)}
            onChange={handleAuctionChange}
            disabled
          />
        </Label>

        <Label>
          End Time:
          <Input
            type="datetime-local"
            name="endTime"
            value={newAuction.startTime.toLocaleString('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).replace(', ', 'T').substring(0, 16)}
            onChange={handleAuctionChange}
            disabled
            color='#ffffff'
          />
        </Label>

        <Label>
          Points Type:
          <PointsSelect
            name="pointsType"
            value={newAuction.pointsType}
            onChange={handleAuctionChange}
          >
            <option value="EzPoints">EzPoints</option> { }
            <option value="ElPoints">ElPoints</option> { }
          </PointsSelect>
        </Label>

        {/* <Label>
          Points Quantity:
          <Input
            type="number"
            name="pointsQuantity"
            value={newAuction.pointsQuantity}
            onChange={handleAuctionChange}
          />
        </Label> */}

        <Label>
          Starting Bid(ezETH):
          <Input
            type="number"
            name="startingBid"
            value={newAuction.startingBid}
            onChange={handleAuctionChange}
          />
        </Label>

        <SubmitButton type="submit">Create Auction</SubmitButton>
      </form>
    </FormContainer>
  );
};



const BackendPage = () => {
  const { address } = useAccount();
  // const [loading, setLoading] = useState(false);

  // const [auctions, setAuctions] = useState<Auction[]>([]);
  const [newAuction, setNewAuction] = useState<AuctionInfo>({
    startTime: new Date(),
    endTime: new Date(),
    pointsType: AuctionType.EzPoints,
    pointsQuantity: 0,
    startingBid: 0,
  });
  newAuction.startTime.setMinutes(newAuction.startTime.getMinutes() + 1);
  newAuction.endTime.setHours(newAuction.startTime.getHours() + 20);
  console.log("newAuction", newAuction);

  const isAdmin = (address != undefined) && (ADMIN_ADDRESS.includes(address.toLowerCase()));

  const handleAuctionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAuction({
      ...newAuction,
      [name]: name === 'startTime' || name === 'endTime' ? new Date(value) : value,
    });
  };

  const handleSubmit = () => {
    // const newAuctions = [...auctions, newAuction];
    // setAuctions(newAuctions);

    console.log("newAuction", newAuction);
    createAuction(newAuction);
    setNewAuction({
      startTime: new Date(),
      endTime: new Date(),
      pointsType: AuctionType.EzPoints,
      pointsQuantity: 0,
      startingBid: 0,
    });
  };

  // const handleDelete = (index: number) => {
  //   const updatedAuctions = auctions.filter((_, i) => i !== index);
  //   setAuctions(updatedAuctions);
  // };

  return (
    <div>
      <h1>Auction Admin</h1>
      {isAdmin ? (
        <div>
          <AuctionForm handleSubmit={handleSubmit}
            newAuction={newAuction}
            handleAuctionChange={handleAuctionChange} />
          {/* <AllAuctions auctions={auctions} handleDelete={handleDelete} /> */}
          {/*<Table
            rowKey="id"
            columns={columns}
            dataSource={auctions}
            expandable={{
              // expandedRowRender: record => (
              //   <EmployeeTable employees={employeesData[record.id] || []} />
              // ),
              expandRowByClick: true,
              // expandedRowKeys: expandedRowKeys,
              // onExpand: handleExpand,
            }}
            loading={loading}
            pagination={false}
          /> */}
        </div>
      ) : (
        <p>You do not have access to this page.</p>
      )}
    </div>
  );
}



export default BackendPage;
