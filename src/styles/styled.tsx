import styled, { keyframes } from "styled-components";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;

  width: 40%;
  // max-width: 70%;
  // margin-top: 8rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  // margin-left: 5%;

  position: absolute;
  top: 16rem;
`;

export const EarnContent = Content;
export const AuctionContent = Content;



export const WalletBalance = styled.div`
  display: flex;
  align-items: center;
  color: #000000;
  font-weight: bold;
  margin-right: 2%;
`;

export const ClickableText = styled.span`
  ${props => props.clickable && `
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #ff0000;
    }
  `}

  margin-left: 5px;
  margin-right: 5px;
`;

// Bid
export const BidContainer = styled.div`

  margin-bottom: 1rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid #E6E6E6;
  color: #333333;

  width: 90%;
`;
export const StatsContainer = BidContainer;

export const SupplyAmmountValue = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-right: 5%;
  color: #000000;
`;

export const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;


export const StatKey = SupplyAmmountValue;


export const AmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 3rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid #E6E6E6;
  color: #333333;

  width: 90%;
`;

export const MaxButton = styled.button`
  padding: 20px 40px;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 10px;


  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #444;
  }
`;

export const BidButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #18181c;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
  width: 20%;
  flex: 1;

  &:hover {
    background-color: #000000;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingIcon = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: ${spin} 1s linear infinite;
`;
