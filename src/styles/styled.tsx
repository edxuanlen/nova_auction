import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;

  width: 40%;
  // max-width: 70%;
  margin-top: 8rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-left: 5%;
`;

export const EarnContent = Content;



export const WalletBalance = styled.div`
  margin-bottom: 20px;
  color: #000000;
  font-weight: bold;
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
  background-color: #18181c;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
  width: 20%;

  &:hover {
    background-color: #000000;
  }
`;
