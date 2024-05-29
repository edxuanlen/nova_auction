import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, erc20Abi, maxUint256, TransactionExecutionError, ContractFunctionExecutionError } from 'viem';
import { ethers } from 'ethers';
// import { readContract } from '@wagmi/core';
import { flowPreviewnet, foundry } from 'viem/chains';
import ETHLogo from '../resources/ethLogo.png';
import { ArrowUpOutlined } from '@ant-design/icons';

import { getezETHBalance } from '../utils/wallet';
import { Tabs, TabButton, InterestHistory, CustomModal } from '../components';
import {
    EarnContent, WalletBalance, AmountContainer,
    StatsContainer, Stat, StatKey, MaxButton,
    BidButton, ClickableText, LoadingIcon
} from '../styles/styled';
import { switchChain } from '@wagmi/core'
import {
    simulateContract, writeContract,
    readContract, waitForTransactionReceipt
} from '@wagmi/core'
import { WalletOptionsButton } from '../Wallet'
import { Divider, Steps, Tooltip, Card, Statistic, Row, Col } from 'antd';

import { InfoCircleOutlined } from '@ant-design/icons';

const SupplyAmountContainer = AmountContainer;

import {
    provider,
    readAuctionContract,
    useWriteAuctionContract,
    useSimulateAuctionContract,
    auctionABI,
    contract,
    getAllowance,
    approveToken,
    getApyHistory,
    getApr,
    getEzETHBalance,
    getFreeEzETHBalance
} from '../utils/contract';

import { flushWalletBalance } from '../utils/wallet';

import { AuctionContractAddress, config } from '../config';
import styled from 'styled-components';
import { EarningInfo } from '../types';
import { formatPercentage } from '../utils/math';
import { useNavigate, useLocation } from 'react-router-dom';
import { extractSignature } from '../utils/error_handler';
import InputWithMax from '../components/InputWithMax';



const EarnPage = () => {
    const [selectedTab, setSelectedTab] = useState('supply');
    const location = useLocation();

    const [current, setCurrent] = useState(0);
    const onChange = (value: number) => {
        console.log('onChange:', value);
        setCurrent(value);
    };

    const [amount, setAmount] = useState(0);
    // const { balance, isFetching, error } = getezETHBalance();

    // const { balance: ezETHBalance } = getezETHBalance();
    const [ezETHBalance, setEzETHBalance] = useState(0);
    const [TotalEarning, setTotalEarning] = useState<undefined | number>(undefined);
    const { isConnected, address } = useAccount();
    const [withdrawBalance, setWithdrawBalance] = useState(0.0);
    const [availableBalance, setAvailableBalance] = useState(0.0);

    const [change, setChange] = useState(true);
    const [needApprove, setNeedApprove] = useState(false);
    const [isOpenIncome, setIsOpenIncome] = useState(false);
    const [isPending, setIsPending] = useState(false);
    // const [_yield, setYield] = useState(0.0);

    const [interestHistory, setInterestHistory] = useState<EarningInfo[]>([]);
    // TODO(dumengrong)
    const [supplyAPR, setSupplyAPR] = useState('0.00');


    const [isOpen, setIsOpen] = useState(false);
    const [modalText, setModalText] = useState('');

    const handleMaxClick = () => {

        if (selectedTab === 'supply') {
            setAmount(ezETHBalance.toFixed(6));
        } else {
            setAmount(availableBalance.toFixed(6));
        }

    };

    useEffect(() => {

        // let selectedTab = getSelectedTab();
        const hash = location.hash.slice(1);
        if (hash === 'supply' || hash === 'withdraw') {
            setSelectedTab(hash);
        } else {
            setSelectedTab('supply');
            navigate(`/earn#supply`);
        }

        switchNetwork();

        setAPR();

        if (address != undefined) {
            flushWalletBalance(address, setEzETHBalance);
            setApyHistory();
        }
        getWithdrawBalance();
        checkApprove();
    }, [change, isConnected]);

    const setAPR = async () => {
        const apr = await getApr();
        setSupplyAPR(apr.toFixed(2));
    }

    const setApyHistory = async () => {
        if (address == undefined) {
            return;
        }
        const { totalInterest, earningInfos: datas } = await getApyHistory(address);
        setTotalEarning(totalInterest);

        setInterestHistory(datas);
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

    const getWithdrawBalance = async () => {
        if (address == undefined) {
            return 0;
        }
        // console.log("convertRes: ", convertRes);
        const balance = await getEzETHBalance(address);
        const freeBalance = await getFreeEzETHBalance(address);
        setAvailableBalance(freeBalance);
        setWithdrawBalance(balance);
    };

    const switchNetwork = async () => {
        if (isConnected) {
            console.log("isConnected: ", isConnected);
            // console.log("")

            const hexString = window.ethereum.chainId;
            const chainIdBigInt = BigInt(hexString);
            const network = await provider.getNetwork();
            try {
                if (chainIdBigInt !== network.chainId) {
                    const chainId = Number(network.chainId);
                    const res = switchChain(config, { chainId });
                    console.log("switch network res: ", res);
                }
            } catch (e) {
                console.log("switch network error: ", e);
            }
        }
    }

    const onSupply = async () => {
        setIsPending(true);
        console.log("onSupply: ", amount);
        if (isNaN(amount) || !isFinite(amount)) {
            setModalText("Invalid amount!");
            setIsOpen(true);
            setIsPending(false);
            return;
        }

        if (address == undefined) {
            setIsOpen(true);
            setModalText("You must login first!");
            setIsPending(false);
            return;
        }

        if (amount > ezETHBalance) {
            setIsOpen(true);
            setModalText("insufficient free balance!");
            setIsPending(false);
            return;
        }

        if (amount === 0) {
            setModalText("Could not deposit 0!");
            setIsOpen(true);
            setIsPending(false);
            return;
        }

        // convert to ether
        const etherAmount = ethers.parseEther(amount.toString())

        try {

            const res = await getAllowance(address);
            if (Number(res) < amount) {
                await onApprove();
            }

            // Prepare contract write, pass contract info and the method to call and its parameters.
            const result = simulateContract(
                config, {
                abi: auctionABI,
                address: AuctionContractAddress,
                functionName: "deposit",
                args: [etherAmount]
            });

            console.log("simulateContract result: ", result);

            const hash = await writeContract(config, {
                abi: auctionABI,
                address: AuctionContractAddress,
                functionName: "deposit",
                args: [etherAmount]
            });

            console.log("hash: ", hash);

            const transactionReceipt = await waitForTransactionReceipt(config, {
                hash: hash,
            })

            console.log("transactionReceipt: ", transactionReceipt);
            setChange(!change);
        } catch (e) {
            console.log("error: ", e);
            if (e instanceof TransactionExecutionError) {
                setModalText(e.details);
                setIsOpen(true);
            }
            if (e instanceof ContractFunctionExecutionError) {
                if (extractSignature(e.shortMessage) === '0xfb8f41b2') {
                    setModalText("ERC20InsufficientAllowance!");
                } else {
                    setModalText(e.shortMessage);
                }
                setIsOpen(true);
            }
        }
        setIsPending(false);
    }

    const onWithdraw = async () => {
        setIsPending(true);
        console.log("onWithdraw: ", amount);
        if (isNaN(amount) || !isFinite(amount)) {
            console.log("金额违法！");
            setIsPending(false);
            return;
        }

        if (address == undefined) {
            console.log("还没登陆！");
            setIsPending(false);
            return;
        }

        if (amount > availableBalance) {
            console.log("你没钱啦: ", availableBalance, amount);
            setIsPending(false);
            return;
        }

        if (amount === 0) {
            console.log("钱不能是空哒！", availableBalance, amount);
            setIsPending(false);
            return;
        }

        // convert to ether
        const etherAmount = ethers.parseEther(amount.toString())

        // etherAmount 需要转换一下
        const LPToken = await readContract(config, {
            abi: auctionABI,
            address: AuctionContractAddress,
            functionName: "toLpToken",
            args: [etherAmount]
        });

        // 准备合约写入，传递合约信息和要调用的方法及其参数

        const result = simulateContract(
            config, {
            abi: auctionABI,
            address: AuctionContractAddress,
            functionName: "withdraw",
            args: [LPToken]
        });

        console.log("simulateContract result: ", result);

        const hash = await writeContract(config, {
            abi: auctionABI,
            address: AuctionContractAddress,
            functionName: "withdraw",
            args: [LPToken]
        });


        console.log("hash: ", hash);

        const transactionReceipt = await waitForTransactionReceipt(config, {
            hash: hash,
        })

        console.log("transactionReceipt: ", transactionReceipt);


        setChange(!change);
        setIsPending(false);
    }

    const onApprove = async () => {
        setIsPending(true);
        if (address == undefined) {
            console.log("还没登陆！");
            setIsPending(false);
            return;
        }
        try {
            await approveToken(address);
            checkApprove();
        } catch (error) {
            console.log("error: ", error);
        } finally {
            if (!needApprove) {
                console.log("needApprove: ", needApprove);
                await setCurrent(1);
            }
            setIsPending(false);
        }
    }

    const navigate = useNavigate();

    const cancelModal = () => {
        setIsOpen(false);
    };

    const handleOKModal = () => {
        setIsOpen(false);
    }

    return (
        <>
            <Card
                bordered={true}
                style={
                    {
                        marginTop: '1rem',
                        width: '10%',
                        backgroundImage: 'linear-gradient(to right, #f6d365, #fda085)'
                    }
                }
            >
                <Statistic
                    title="EzETH Earn APR"
                    value={supplyAPR}
                    precision={2}
                    style={{ fontWeight: 'bold' }}
                    valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                // loading={supplyAPR === '0.00'}
                />
            </Card >

            <EarnContent>
                <Tabs selectedTab={selectedTab} onTabClick={function (tab: string): void {
                    setSelectedTab(tab);
                    // selectedTab = tab;
                    getWithdrawBalance();
                    setAmount(0);
                    if (address != undefined) {
                        flushWalletBalance(address, setEzETHBalance);
                    }
                    navigate(`/earn#${tab}`);
                }} />

                {(current != 0 || needApprove) && (
                    <Row gutter={24}>
                        <Col span={6}>
                            <Steps
                                current={current}
                                onChange={onChange}
                                direction="vertical"
                                items={[
                                    {
                                        title: 'Step 1',
                                        description: 'approve ezETH',
                                        disabled: true
                                    },
                                    {
                                        title: 'Step 2',
                                        disabled: true
                                    },
                                ]}
                            />
                        </Col>
                        <Col span={8} > </Col>
                        <Col span={5} style={{
                            marginTop: '1rem', display: 'flex', justifyContent: 'center',
                            height: '100%'
                        }}>
                            <BidButton onClick={onApprove} >
                                Approve ezETH
                            </BidButton>
                        </Col>

                    </Row>
                )}

                <SupplyAmountContainer>
                    <Currency>
                        <img src={ETHLogo} alt="ETH" style={{ width: '60px', height: '60px' }} />
                        <span style={{ fontWeight: 'bold', fontSize: '24px' }} >ezETH</span>
                    </Currency>
                    <AuctionAmountRight>
                        <InputWithMax
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            onMax={handleMaxClick}
                        />


                        {isConnected && (
                            <>
                                <BidButton
                                    onClick={selectedTab === 'supply' ? onSupply : onWithdraw}
                                    disabled={selectedTab === 'withdraw' ? amount > availableBalance : false || isPending}
                                    style={{
                                        backgroundColor: !(selectedTab === 'withdraw' ? amount <= availableBalance : true) ? '#ccc' : '',
                                        cursor: !(selectedTab === 'withdraw' ? amount <= availableBalance : true) ? 'not-allowed' : '',
                                        flex: 1,
                                        marginRight: '8px',
                                    }}
                                >
                                    {isPending ? <LoadingIcon /> : selectedTab === 'supply' ? 'Supply' : 'Withdraw'}
                                </BidButton>
                                {selectedTab === 'supply' && (
                                    <Tooltip
                                        color='gold' key='gold'
                                        title={
                                            <>
                                                Please note: Funds cannot be withdrawn within 24 hours of deposit.
                                                <br />
                                                Please ensure that you have carefully read and understood the relevant rules before depositing funds.
                                            </>
                                        }
                                    >
                                        <InfoCircleOutlined style={{ cursor: 'pointer', color: 'blue' }} />
                                    </Tooltip>
                                )}
                            </>
                        )}

                    </AuctionAmountRight>
                </SupplyAmountContainer>

                {selectedTab === 'supply' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <WalletBalance>Wallet Balance: {ezETHBalance ? ezETHBalance.toFixed(6) : '0'}
                            <ETHMiniLogoImage src={ETHLogo} alt="MiniEthLogo" />
                        </WalletBalance>
                        <WalletBalance>
                            Earnings: <ClickableText clickable='true' onClick={() => { setIsOpenIncome(true) }}>{TotalEarning?.toFixed(6) ?? (isConnected ? <LoadingIcon /> : 0)}</ClickableText> ezETH
                        </WalletBalance>
                        {address &&
                            (
                                <InterestHistory infos={interestHistory}
                                    isOpen={isOpenIncome}
                                    onClose={() => (setIsOpenIncome(false))} />
                            )}

                    </div>
                )}
                {selectedTab === 'withdraw' && (
                    <WalletBalanceWrapper>
                        <WalletBalance>My Current Balance: {withdrawBalance.toFixed(6)} (
                            <Tooltip
                                color='gold' key='gold'
                                title={
                                    <>
                                        Available balance represents the amount that can be withdrawn or used for transactions.
                                        <br />
                                        Please note that there is a one-day cooling period for newly added funds, during which they cannot be withdrawn.
                                    </>
                                }
                            >
                                <InfoCircleOutlined style={{ marginLeft: '4px', cursor: 'pointer' }} />
                            </Tooltip>
                            Available
                            : {availableBalance.toFixed(6)})
                        </WalletBalance>
                        <ETHMiniLogoImage src={ETHLogo} alt="MiniEthLogo" />
                    </WalletBalanceWrapper>
                )
                }

                <h3 style={{ color: '#000000' }}>My Stats</h3>
                <StatsContainer>
                    <Stat>
                        <StatKey>My total captial</StatKey>
                        <SupplyAmmountValue>{withdrawBalance.toFixed(6)} ezETH</SupplyAmmountValue>
                    </Stat>
                    <Stat>
                        <StatKey>Supply APR</StatKey>
                        <TotalPriceValue>{supplyAPR}%</TotalPriceValue>
                    </Stat>
                </StatsContainer>
                <BidButtonContainer>
                    <CustomModal
                        onCancel={cancelModal}
                        open={isOpen}
                        onOk={handleOKModal}
                        modalText={modalText} />

                </BidButtonContainer>
            </EarnContent >
        </>
    );
};


const Currency = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }
`;

const AuctionAmountRight = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #000000;
  margin-left: 10px;
`;

const SupplyAmmountValue = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-right: 5%;
  color: #000000;
`;

const TotalPriceValue = styled.div`
  // display: flex;
  // justify-content: flex-end;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 5%;
  color: #4ebe80;
`;


const BidButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
`;

const WalletBalanceWrapper = styled.div`
    display: flex;
    align-items: center;
    // margin-right: 5rem;
`;

const ETHMiniLogoImage = styled.img`
  height: 40px;
`;

export default EarnPage;
