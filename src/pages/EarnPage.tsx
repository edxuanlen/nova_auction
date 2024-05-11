import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, erc20Abi, maxUint256 } from 'viem';
import { ethers } from 'ethers';
// import { readContract } from '@wagmi/core';
import { foundry } from 'viem/chains';
import ETHLogo from '../resources/ethLogo.png';

import { getezETHBalance } from '../utils/wallet';
import { Tabs, TabButton } from '../components';
import {
    EarnContent, WalletBalance, AmountContainer,
    StatsContainer, Stat, StatKey, MaxButton, BidButton
} from '../styles/styled';
import { switchChain } from '@wagmi/core'
import {
    simulateContract, writeContract,
    readContract, waitForTransactionReceipt
} from '@wagmi/core'
import { WalletOptionsButton } from '../Wallet'

const SupplyAmountContainer = AmountContainer;

import {
    provider,
    readAuctionContract,
    useWriteAuctionContract,
    auctionContractAddress,
    ezETHContractAddress,
    useSimulateAuctionContract,
    auctionABI,
    contract,
    getAllowance,
    approveToken,
} from '../utils/contract';

import { config } from '../config';
import styled from 'styled-components';


const EarnPage = () => {


    const [selectedTab, setSelectedTab] = useState('supply');

    const [amount, setAmount] = useState(0);
    // const { balance, isFetching, error } = getezETHBalance();

    // const { balance: ezETHBalance } = getezETHBalance();
    const [ezETHBalance, setezETHBalance] = useState(0);
    const { isConnected, address } = useAccount();
    const [withdrawBalance, setWithdrawBalance] = useState(0.0);
    const [withdrawBalanceShow, setWithdrawBalanceShow] = useState('0');
    const [change, setChange] = useState(true);
    const [needApprove, setNeedApprove] = useState(false);
    // TODO(dumengrong)
    const supplyAPR = 30;

    const handleMaxClick = () => {

        if (selectedTab === 'supply') {
            if (ezETHBalance != null) {
                setAmount(ezETHBalance);
            } else {
                setAmount(0);
            }
        } else {
            if (withdrawBalance != null) {
                const num: number = withdrawBalance;
                setAmount(num);
            } else {
                setAmount(0);
            }
        }

    };

    useEffect(() => {
        getWalletBalance();
        getWithdrawBalance();
        checkApprove();


    }, [change, isConnected]);

    const checkApprove = async () => {
        if (address == undefined) {
            return;
        }
        const res = await getAllowance(address);
        if (res != '0') {
            setNeedApprove(false);
        } else {
            setNeedApprove(true);
        }
    }

    const getWalletBalance = async () => {
        if (ezETHBalance == null || address == undefined) {
            return;
        } else {
            const result = await readContract(config, {
                abi: erc20Abi,
                address: ezETHContractAddress,
                functionName: 'balanceOf',
                args: [address]
            });
            console.log("wallet balance result:", result);

            setezETHBalance(Number(Number(ethers.formatEther(result)).toFixed(6)));
        }
    };


    const getWithdrawBalance = async () => {
        if (address == undefined) {
            return 0;
        }

        const tokenAddress = await readContract(config, {
            abi: auctionABI,
            address: auctionContractAddress,
            functionName: 'getLpToken'
        });

        console.log("tokenAddress: ", tokenAddress);

        const result = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'balanceOf',
            args: [address]
        });
        console.log("result:", result);


        console.log("withdraw balance: ", result);
        const convertRes = await readContract(config, {
            abi: auctionABI,
            address: auctionContractAddress,
            functionName: 'toMainToken',
            args: [result]
        });

        console.log("convertRes: ", convertRes);

        const balance = Number(ethers.formatEther(convertRes));
        setWithdrawBalance(balance);
        setWithdrawBalanceShow(balance.toFixed(6));
    };


    // console.log(result);


    provider.on("network", (newNetwork, oldNetwork) => {
        console.info(newNetwork, oldNetwork);
        // if (oldNetwork) {
        //   if (newNetwork.chainId !== desiredChainId) {
        //     alert("Please switch the network to " + desiredNetworkName);
        //   }
        // }
    });


    // Assuming 'supply' is the default selected tab


    // console.log("ethereum: ", window.ethereum.chainId);
    // const chainId = useChainId({
    //   config,
    // })
    // console.log("chainId: ", chainId);
    if (isConnected) {
        const hexString = window.ethereum.chainId;
        const chainIdBigInt = BigInt(hexString);
        if (chainIdBigInt !== provider._network.chainId) {
            console.log(chainIdBigInt, provider._network.chainId);
            const chainId = Number(provider._network.chainId);
            for (const [key, value] of Object.entries(config.chains)) {
                if (value.id === chainId) {
                    const res = switchChain(config, { chainId });
                    // console.log("res: ", res)
                }
            }

        }
    }



    const onSupply = async () => {
        console.log("onSupply: ", amount);
        if (isNaN(amount) || !isFinite(amount)) {
            console.log("金额违法！");
            return;
        }

        if (address == undefined) {
            console.log("还没登陆！");
            return;
        }

        if (amount > ezETHBalance) {
            console.log("你没钱啦: ", ezETHBalance, amount);
            return;
        }

        if (amount === 0) {
            console.log("钱不能是空哒！", ezETHBalance, amount);
            return;
        }

        console.log("你即将支付:", amount);

        // convert to ether
        const etherAmount = ethers.parseEther(amount.toString())

        // 准备合约写入，传递合约信息和要调用的方法及其参数
        const result = simulateContract(
            config, {
            abi: auctionABI,
            address: auctionContractAddress,
            functionName: "deposit",
            args: [etherAmount]
        });

        console.log("simulateContract result: ", result);

        const hash = await writeContract(config, {
            abi: auctionABI,
            address: auctionContractAddress,
            functionName: "deposit",
            args: [etherAmount]
        });

        console.log("hash: ", hash);

        const transactionReceipt = waitForTransactionReceipt(config, {
            hash: hash,
        })

        console.log("transactionReceipt: ", transactionReceipt);
        setChange(!change);
    }

    const onWithdraw = async () => {
        console.log("onWithdraw: ", amount);
        if (isNaN(amount) || !isFinite(amount)) {
            console.log("金额违法！");
            return;
        }

        if (address == undefined) {
            console.log("还没登陆！");
            return;
        }

        if (amount > withdrawBalance) {
            console.log("你没钱啦: ", withdrawBalance, amount);
            return;
        }

        if (amount === 0) {
            console.log("钱不能是空哒！", withdrawBalance, amount);
            return;
        }

        // convert to ether
        const etherAmount = ethers.parseEther(amount.toString())

        // etherAmount 需要转换一下
        const LPToken = await readContract(config, {
            abi: auctionABI,
            address: auctionContractAddress,
            functionName: "toLpToken",
            args: [etherAmount]
        });

        // 准备合约写入，传递合约信息和要调用的方法及其参数

        const result = simulateContract(
            config, {
            abi: auctionABI,
            address: auctionContractAddress,
            functionName: "withdraw",
            args: [LPToken]
        });

        console.log("simulateContract result: ", result);

        const hash = await writeContract(config, {
            abi: auctionABI,
            address: auctionContractAddress,
            functionName: "withdraw",
            args: [LPToken]
        });


        console.log("hash: ", hash);

        const transactionReceipt = waitForTransactionReceipt(config, {
            hash: hash,
        })

        console.log("transactionReceipt: ", transactionReceipt);


        setChange(!change);
    }

    const onApprove = async () => {
        if (address == undefined) {
            console.log("还没登陆！");
            return;
        }
        console.log("onApprove allowance.");
        approveToken(address);
    }

    return (
        <EarnContent>
            <Tabs selectedTab={selectedTab} onTabClick={function (tab: string): void {
                // throw new Error('Function not implemented.');
                setSelectedTab(tab);
                getWithdrawBalance();
                getWalletBalance();
            }} />


            <SupplyAmountContainer>
                <Currency>
                    <img src={ETHLogo} alt="ETH" style={{ width: '60px', height: '60px' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '24px' }} >ezETH</span>
                </Currency>
                <AuctionAmountRight>
                    <AmountInput
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                    <MaxButton onClick={handleMaxClick}>MAX</MaxButton>
                </AuctionAmountRight>
            </SupplyAmountContainer>

            {selectedTab === 'supply' && (
                <>
                    <WalletBalance>Wallet Balance: {ezETHBalance ? ezETHBalance : '0'} ezETH</WalletBalance>
                </>
            )}
            {selectedTab === 'withdraw' && (
                <>
                    <WalletBalance>Max Withdraw Amount: {withdrawBalanceShow} ezETH</WalletBalance>
                </>
            )}

            <h3 style={{ color: '#000000' }}>My Stats</h3>
            <StatsContainer>
                <Stat>
                    <StatKey>My total captial</StatKey>
                    <SupplyAmmountValue>{withdrawBalanceShow} ezETH</SupplyAmmountValue>
                </Stat>
                <Stat>
                    <StatKey>Supply APR</StatKey>
                    <TotalPriceValue>{supplyAPR}%</TotalPriceValue>
                </Stat>
            </StatsContainer>
            <BidButtonContainer>
                {needApprove && (
                    <BidButton
                        onClick={onApprove}
                    >
                        'Approve ezETH'
                    </BidButton>
                )}
                {!needApprove && isConnected ? (
                    <BidButton
                        onClick={selectedTab === 'supply' ? onSupply : onWithdraw}
                        disabled={selectedTab === 'withdraw' ? amount > withdrawBalance : false}
                        style={{ backgroundColor: !(selectedTab === 'withdraw' ? amount <= withdrawBalance : true) ? '#ccc' : '', cursor: !(selectedTab === 'withdraw' ? amount <= withdrawBalance : true) ? 'not-allowed' : '' }}
                    >
                        {selectedTab === 'supply' ? 'Supply' : 'Withdraw'}
                    </BidButton>
                ) : (
                    <WalletOptionsButton />
                )}
            </BidButtonContainer>
        </EarnContent >
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

const AmountInput = styled.input`
  padding: 10px;
  background-color: #fff;
  color: #000000;
  font-size: 20px;
  margin-right: 10px;

  &:focus {
    outline: none;
  }
`;

export default EarnPage;
