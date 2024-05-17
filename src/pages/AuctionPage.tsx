import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import ETHLogo from '../resources/ethLogo.png';

import {
    AuctionContent, AmountContainer, BidButton, LoadingIcon
} from '../styles/styled';
import {
    simulateContract, writeContract,
    readContract, waitForTransactionReceipt
} from '@wagmi/core'

import {
    auctionABI,
    getAllowance,
    approveToken,
    getLogerWithWalletAddress
} from '../utils/contract';

import { flushWalletBalance } from '../utils/wallet';

import { AuctionContractAddress, config } from '../config';
import styled from 'styled-components';
import { EventInfo } from '../types';

import { startCountdownTimer } from '../utils/time';

import RenzoLogo from '../resources/renzo.png';
import EigenLayerLogo from '../resources/eigenlayer.png';

import { PointsTabs, CustomModal, BidHistory, LogCollector, SuccessNotification } from '../components';
import { useNavigate } from 'react-router-dom';

const AuctionAmountContainer = AmountContainer;

const AuctionPage = () => {
    const [lastTradedPrice, setLastTradedPrice] = useState<number | undefined>(undefined);
    const [auctionCountdown, setAuctionCountdown] = useState({ hours: '00', minutes: '00', seconds: '00' });
    const [countdownType, setCountdownType] = useState('begin');

    const [bidQuantity, setBidQuantity] = useState('0');
    const [bidPrice, setBidPrice] = useState('0');
    const [totalPrice, setTotalPrice] = useState('0');
    const [startingPrice, setStartingPrice] = useState(0);
    const [pointsToSell, setPointsToSell] = useState(0);

    const { isConnected, address } = useAccount();
    const [isPending, setIsPending] = useState(false);

    // const [amountOfezETH, setAmountOfezETH] = useState(0.0);
    const [amountOfEzPoints, setAmountOfEzPoints] = useState(0.0);
    const [amountOfElPoints, setAmountOfElPoints] = useState(0.0);

    const [selectedTab, setSelectedTab] = useState('EzPoints');
    const [needApprove, setNeedApprove] = useState(true);
    const [totalPoints, setTotalPoints] = useState<number | undefined>(undefined);
    const [lastBid, setLastBid] = useState<EventInfo | undefined>(undefined);
    const [showLastBid, setShowLastBid] = useState(false);


    const pointsStr2Num = new Map<string, number>();
    pointsStr2Num.set('ElPoints', 0);
    pointsStr2Num.set('EzPoints', 1);
    const pointsNum2Str = new Map<number, string>();
    pointsNum2Str.set(0, 'ElPoints');
    pointsNum2Str.set(1, 'EzPoints');
    const [ezETHBalance, setEzETHBalance] = useState(0);

    // 弹窗
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenBidHistory, setIsOpenBidHistory] = useState(false);

    const [modalText, setModalText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const hash = location.hash.slice(1);
        if (hash === 'EzPoints' || hash === 'ElPoints') {
            setSelectedTab(hash);
        } else {
            setSelectedTab('EzPoints');
            navigate(`/auction#EzPoints`);
        }

        // 从合约中获取拍卖倒计时
        getAuctionCountdown();

        if (address != undefined) {
            flushWalletBalance(address, setEzETHBalance);
        }

    }, []);

    useEffect(() => {
        console.log("Effect selectedTab: ", selectedTab);
        getAuctionCountdown();
    }, [selectedTab]);

    const [events, setEvents] = useState<EventInfo[] | undefined>(undefined);

    const isFetchingBidHistoryRef = useRef(false);

    useEffect(() => {
        fetchBidHistory();
    }, [address, selectedTab]);

    const fetchBidHistory = async () => {
        if (address === undefined || address === null || isFetchingBidHistoryRef.current) {
            return;
        }

        isFetchingBidHistoryRef.current = true;

        try {
            const logs = await getLogerWithWalletAddress(address);

            let points = 0;
            let lastPrice = 0;
            let typeFilterLogs: (EventInfo)[] = [];
            for (let log of logs) {
                if (pointsNum2Str.get(Number(log.pointType)) == selectedTab) {
                    typeFilterLogs.push(log);
                    if (log.eventType == "Deal" && pointsNum2Str.has(Number(log.pointType))) {
                        points += Number(ethers.formatEther(log.bidPoints));
                        lastPrice = Number(ethers.formatEther(log.bidPrice));
                    }
                }
            }

            setLastTradedPrice(lastPrice);

            const lastEvent = typeFilterLogs[typeFilterLogs.length - 1];
            if (lastEvent && lastEvent.eventType == "Charge") {
                console.log("lastEvent: ", lastEvent);
                await setLastBid(lastEvent);
                setShowLastBid(true);
            } else {
                setShowLastBid(false);
            }

            setTotalPoints(points);
            setEvents(typeFilterLogs);

            const result = await getAllowance(address);
            if (Number(result) === 0) {
                console.log("Number result", Number(result))
                setNeedApprove(true);
            } else {
                setNeedApprove(false);
            }
        } catch (error) {
            console.error("Error fetching bid history:", error);
        } finally {
            isFetchingBidHistoryRef.current = false;
        }
    };

    const getAuctionCountdown = async () => {
        const pointsType = pointsStr2Num.get(selectedTab);
        if (pointsType == undefined) {
            return;
        }
        console.log("pointsType: ", pointsType);
        console.log("selectedTab: ", selectedTab);
        const startTimeResult = await readContract(
            config, {
            abi: auctionABI,
            address: AuctionContractAddress,
            functionName: "getAuctionInfo",
            args: [pointsType]
        });
        const [startTime, duration, pointsToSell, startingPrice, state] = startTimeResult;
        const nowSec = Math.floor(Date.now() / 1000);

        if (nowSec > startTime + duration) {
            return;
        }

        if (startTime < nowSec) {
            startCountdownTimer(Number(startTime), Number(duration), 1, setAuctionCountdown, getAuctionCountdown);
            setCountdownType('end');
        } else {
            startCountdownTimer(nowSec, Number(startTime) - nowSec, 1, setAuctionCountdown, getAuctionCountdown);
            setCountdownType('begin');
        }
        console.log("setCountdownType: ", countdownType);
        // TOCHECK?

        const starting_price = Number(ethers.formatEther(startingPrice));
        const points_to_sell = Number(ethers.formatEther(pointsToSell));
        setStartingPrice(starting_price);
        setPointsToSell(points_to_sell);

        if (selectedTab == "EzPoints") {
            setAmountOfEzPoints(points_to_sell);
        } else {
            setAmountOfElPoints(points_to_sell);
        }

        setBidQuantity(points_to_sell.toFixed(0));
        console.log("points to sell", points_to_sell);
        setBidPrice(starting_price.toFixed(4));
        setTotalPrice((starting_price * points_to_sell).toFixed(6));
        // pointsToSell
        // startingPrice
    };


    const handleBidQuantityChange = (e) => {
        const quantity = e.target.value;
        setBidQuantity(quantity);
        setTotalPrice((quantity * Number(bidPrice)).toFixed(6));
    };

    const handleBidPriceChange = (e) => {
        const price = e.target.value;
        setBidPrice(price);
        setTotalPrice((Number(bidQuantity) * price).toFixed(6));
    };

    const handleBid = async () => {
        setIsPending(true);
        if (!isConnected) {
            console.log('Wallet not connected');
            setIsPending(false);
            return;
        }

        if (Number(bidPrice) <= 0 || Number(bidQuantity) <= 0) {
            console.log('Bid price and quantity must be greater than 0');
            setModalText('Bid price and quantity must be greater than 0');
            setIsOpen(true);
            setIsPending(false);
            return;
        }

        if (Number(bidPrice) < startingPrice) {
            console.log('Bid price must be greater than starting price');
            console.log('Bid price:', bidPrice);
            console.log('Starting price:', startingPrice.toFixed(4));
            setModalText(`Bid price must be greater than starting price.
            BidPrice: {bidPrice} ezETH Starting price: ${startingPrice.toFixed(4)}`);
            setIsOpen(true);
            setIsPending(false);
            return;
        }

        if (Number(bidQuantity) > pointsToSell) {
            console.log('Bid quantity must be less than points to sell');
            console.log('Bid quantity:', bidQuantity);
            console.log('Points to sell:', pointsToSell);
            setModalText(`Exceeding the auction supply`);
            setIsOpen(true);
            setIsPending(false);
            return;
        }

        // Implement logic to place a bid
        console.log('Placing bid:', bidQuantity, 'at', bidPrice, 'ETH');

        const pointsType = pointsStr2Num.get(selectedTab);
        if (pointsType == undefined) {
            setIsPending(false);
            return;
        }

        console.log("BIDPRICE", ethers.parseEther(bidPrice.toString()));
        console.log("BIDQUANTITY", ethers.parseEther(bidQuantity.toString()));
        // 调用合约接口进行出价
        try {
            const { result } = await simulateContract(
                config, {
                abi: auctionABI,
                address: AuctionContractAddress,
                functionName: "placeBid",
                args: [
                    ethers.parseEther(bidPrice.toString()),
                    ethers.parseEther(bidQuantity.toString()),
                    pointsType]
            });
            console.log("simulateContract placeBid result: ", result);

            const hash = await writeContract(config, {
                abi: auctionABI,
                address: AuctionContractAddress,
                functionName: "placeBid",
                args: [
                    ethers.parseEther(bidPrice.toString()),
                    ethers.parseEther(bidQuantity.toString()),
                    pointsType]
            });

            console.log("hash: ", hash);

            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: hash,
            })

            console.log("transactionReceipt: ", transactionReceipt);
            fetchBidHistory();
        } catch (error) {
            console.log("error: ", error);
        }
        setIsPending(false);
    };

    const cancelModal = () => {
        setIsOpen(false);
    };

    const handleOKModal = () => {
        setIsOpen(false);
    }

    const checkApprove = async () => {
        if (address == undefined) {
            return;
        }
        const res = await getAllowance(address);
        if (Number(res) != 0) {
            setNeedApprove(false);
        } else {
            setNeedApprove(true);
        }
    }

    const onApprove = async () => {
        if (address == undefined) {
            console.log("还没登陆！");
            return;
        }
        await approveToken(address);
        checkApprove();
    }
    return (
        <AuctionContent>
            <PointsTabs selectedTab={selectedTab} onTabClick={function (tab: string): void {
                if (selectedTab == tab) return;
                setShowLastBid(false);
                setSelectedTab(tab);
                navigate(`/auction#${tab}`);
                setTotalPoints(undefined);
                setLastTradedPrice(undefined);
                setEvents(undefined);
            }} />

            <PriceInfoContainer>
                <LastTradedPriceContainer>
                    <LastTradedPriceLabel>Last Traded Price:</LastTradedPriceLabel>
                    <LastTradedPriceValue>{lastTradedPrice?.toFixed(6) ?? (isConnected ? <LoadingIcon /> : 0)}</LastTradedPriceValue>
                    <ETHMiniLogoImage src={ETHLogo} alt="MiniEthLogo" />
                </LastTradedPriceContainer>

                <LastTradedPriceContainer>
                    <LastTradedPriceLabel>Total Points Earn:</LastTradedPriceLabel>
                    <LastTradedPriceValue>{totalPoints?.toFixed(6) ?? (isConnected ? <LoadingIcon /> : 0)}</LastTradedPriceValue>
                </LastTradedPriceContainer>
            </PriceInfoContainer>

            <AuctionAmountContainer>
                <AuctionAmountLeft>
                    {selectedTab == 'EzPoints' ?
                        <ETHLogoImage src={RenzoLogo} alt='RenzoLogo' />
                        : <ETHLogoImage src={EigenLayerLogo} alt='EigenLayerLogo' />
                    }
                    <ETHLogoText>Points</ETHLogoText>
                    {/* <ETHLogoImage src={ETHLogo} alt="MiniEthLogo" /> */}
                </AuctionAmountLeft>
                <AuctionAmountRight>
                    {/* TODO: amount of points */}
                    Total Supply Amount: {selectedTab == 'EzPoints' ? amountOfEzPoints.toFixed(6) : amountOfElPoints.toFixed(6)}
                </AuctionAmountRight>
            </AuctionAmountContainer>

            <AuctionCountdownContainer>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {countdownType == 'end' && (
                        <AuctionCountdownLabel>Auction End Countdown:</AuctionCountdownLabel>
                    )}
                    {countdownType == 'begin' && (
                        <AuctionCountdownLabel>Auction Start Countdown:</AuctionCountdownLabel>
                    )}
                    <AuctionCountdownValues>
                        <AuctionCountdownValue>
                            <span>{auctionCountdown.hours}</span>
                        </AuctionCountdownValue>
                        <AuctionCountdownSign> : </AuctionCountdownSign>
                        <AuctionCountdownValue>
                            <span>{auctionCountdown.minutes}</span>
                        </AuctionCountdownValue>
                        <AuctionCountdownSign>  :  </AuctionCountdownSign>
                        <AuctionCountdownValue>
                            <span>{auctionCountdown.seconds}</span>
                        </AuctionCountdownValue>
                    </AuctionCountdownValues>
                </div>

                <MyBidHistoryContainer>

                    <BidHistoryButton onClick={() => setIsOpenBidHistory(true)}>My Bid History<ArrowIcon /></BidHistoryButton>
                    {address && events &&
                        (
                            <BidHistory events={events}
                                isOpen={isOpenBidHistory}
                                filter={pointsStr2Num.has(selectedTab) ? pointsStr2Num.get(selectedTab) : 0n}
                                onClose={() => (setIsOpenBidHistory(false))} />
                        )}
                    {address && events == undefined && <LoadingIcon />}
                </MyBidHistoryContainer>
            </AuctionCountdownContainer>

            <BidContainer>
                <BidInputContainer>

                    <BidInputItem>
                        <BidLabel>Bidding Quantity:</BidLabel>
                        <BidQuantityInput
                            // type="number"
                            value={bidQuantity}
                            onChange={handleBidQuantityChange}
                        />
                    </BidInputItem>
                    <BidInputItem>


                        <BidLabel>Bidding Price:</BidLabel>
                        <BidPriceInput
                            // type="number"
                            value={bidPrice}
                            onChange={handleBidPriceChange}
                        />
                        <ETHMiniLogoImage src={ETHLogo} alt="MiniEthLogo" />
                    </BidInputItem>
                </BidInputContainer>
                <TotalPriceContainer>
                    <TotalPriceKey>
                        Total Price:
                    </TotalPriceKey>
                    <TotalPriceValue>
                        {totalPrice} ezETH
                        <ETHMiniLogoImage src={ETHLogo} alt="MiniEthLogo" />
                    </TotalPriceValue>
                </TotalPriceContainer>
            </BidContainer>


            <BidButtonContainer>

                {needApprove && (
                    <BidButton onClick={onApprove} >Approve ezETH</BidButton>
                )}
                {!needApprove && ((Number(totalPrice) <= ezETHBalance) ?
                    <BidButton onClick={handleBid} disabled={isPending}>
                        {isPending ? <LoadingIcon /> : 'Bid'}
                    </BidButton>
                    :
                    <BidButton>Insufficient balance</BidButton>)
                }

                {showLastBid && (<SuccessNotification lastBid={lastBid} />)}
                <CustomModal
                    onCancel={cancelModal}
                    open={isOpen}
                    onOk={handleOKModal}
                    modalText={modalText} />
            </BidButtonContainer>
        </AuctionContent >
    );
};


const PriceInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LastTradedPriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5rem;
`;
const LastTradedPriceLabel = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  margin-right: 0.5rem;
  margin-left: 2.5rem;
  color: #000000;
`;

const LastTradedPriceValue = styled.span`
  font-size: 0.9rem;
  color: #007bff;
  margin-right: 0.5rem;
`;

const AuctionAmountLeft = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  margin-right: 0.5rem;

  display: flex;
  align-items: center;
`;

const AuctionAmountRight = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #000000;
  margin-left: 10px;
`;

const MyBidHistoryContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5%;

`;


const BidHistoryButton = styled.button`
  display: flex;
  flex-direction: row;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #495057;
  }

`;

const ETHLogoImage = styled.img`
  height: 60px;
`;

const ETHMiniLogoImage = styled.img`
  height: 30px;
`;

const ETHLogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000000;
  margin-left: 10px;

`;


const AuctionCountdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const AuctionCountdownLabel = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin-right: 0.5rem;
  color: #000000;
`;


const AuctionCountdownValue = styled.div`
  background-color: #333;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  color: #fff;

  & > span {
    margin: 0 0.25rem;
  }
`;


const AuctionCountdownValues = styled.div`
  display: flex;
`;

const AuctionCountdownSign = styled.span`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  color: #000000;

`;

const ArrowIcon = styled.div`
  width: 12px;
  height: 12px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg);
  margin-left: 0.5rem;
`;

// Bid
const BidContainer = styled.div`

  margin-bottom: 1rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid #E6E6E6;
  color: #333333;

  width: 90%;
`;

const BidInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 100%;
`;

const BidInputItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 1rem;
`;

const BidLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
  margin-right: 0.75rem;
`;

const BidQuantityInput = styled.input`
  width: 120px;
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 2px solid #ebebeb;
  border-radius: 0.25rem;
  background-color: #ebebeb;
  color: #000000;
  margin-right: 0.75rem;
  font-weight: bold;
`;

const BidPriceInput = styled.input`
  width: 120px;
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 2px solid #ebebeb;
  border-radius: 0.25rem;
  background-color: #ebebeb;
  color: #000000;
  margin-right: 0.75rem;
  font-weight: bold;
`;

const BidButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
`;

const TotalPriceContainer = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  font-size: 1rem;
  font-weight: bold;
`;


const TotalPriceKey = styled.div`
  // display: flex;
  // justify-content: ;
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
`;

const TotalPriceValue = styled.div`
  display: flex;
  // justify-content: flex-end;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 5%;
  color: #4ebe80;
`;


export default AuctionPage;
