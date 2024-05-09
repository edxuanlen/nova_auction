import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { ADMIN_ADDRESS } from '../config';
import { useAccount, } from 'wagmi';

interface Auction {
    startTime: Date;
    endTime: Date;
    pointsType: string;
    pointsQuantity: number;
    startingBid: number;
}

const Container = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
`;

const AdminContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;


// const Label = styled.label`
//   display: block;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   padding: 5px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   margin-bottom: 10px;
// `;

const Select = styled.select`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

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
    auctions: Auction[];
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


// 表单容器
const FormContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 500px;
  margin: 20px auto; // 居中
`;

const PointsSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
`;


// 标签样式
const Label = styled.label`
  font-weight: bold;
  display: block; // 使每个标签独立一行
  margin-bottom: 8px; // 为标签和输入框之间添加间距
`;

// 输入框样式
const Input = styled.input`
  width: 100%; // 使输入框占满宽度
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px; // 每个输入框之间添加间距
`;

// 按钮样式
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
    newAuction: Auction;
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
                        value={newAuction.startTime.toISOString().substring(0, 16)}
                        onChange={handleAuctionChange}
                    />
                </Label>

                <Label>
                    End Time:
                    <Input
                        type="datetime-local"
                        name="endTime"
                        value={newAuction.endTime.toISOString().substring(0, 16)}
                        onChange={handleAuctionChange}
                    />
                </Label>

                <Label>
                    Points Type:
                    <PointsSelect
                        name="pointsType"
                        value={newAuction.pointsType}
                        onChange={handleAuctionChange}
                    >
                        <option value="EzPoints">EzPoints</option> {/* 第一个选项 */}
                        <option value="ElPoints">ElPoints</option> {/* 第二个选项 */}
                    </PointsSelect>
                </Label>

                <Label>
                    Points Quantity:
                    <Input
                        type="number"
                        name="pointsQuantity"
                        value={newAuction.pointsQuantity}
                        onChange={handleAuctionChange}
                    />
                </Label>

                <Label>
                    Starting Bid:
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

    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [newAuction, setNewAuction] = useState<Auction>({
        startTime: new Date(),
        endTime: new Date(),
        pointsType: '',
        pointsQuantity: 0,
        startingBid: 0,
    });

    // 用于判断当前用户是否是管理员
    const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

    const handleAuctionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAuction({
            ...newAuction,
            [name]: name === 'startTime' || name === 'endTime' ? new Date(value) : value,
        });
    };

    const handleSubmit = () => {
        // 处理提交拍卖会的逻辑
        const newAuctions = [...auctions, newAuction];
        setAuctions(newAuctions);
        // 清空表单
        setNewAuction({
            startTime: new Date(),
            endTime: new Date(),
            pointsType: '',
            pointsQuantity: 0,
            startingBid: 0,
        });
    };

    const handleDelete = (index: number) => {
        const updatedAuctions = auctions.filter((_, i) => i !== index);
        setAuctions(updatedAuctions);
    };

    return (
        <div>
            <h1>Auction Admin</h1>
            {isAdmin ? (
                <div>
                    <AuctionForm handleSubmit={handleSubmit}
                        newAuction={newAuction}
                        handleAuctionChange={handleAuctionChange} />
                    <AllAuctions auctions={auctions} handleDelete={handleDelete} />
                </div>
            ) : (
                <p>You do not have access to this page.</p>
            )}
        </div>
    );
}



export default BackendPage;
