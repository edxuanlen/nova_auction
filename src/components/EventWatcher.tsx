import { watchContractEvent } from '@wagmi/core'
import { auctionABI, auctionContractAddress, ezETHContractAddress } from '../utils/contract'
import { config } from '../config'

import { useInfiniteReadContracts } from 'wagmi'

const mlootContractConfig = {
    address: '0x1dfe7ca09e99d10835bf73044a23b73fc20623df',
    abi: auctionABI,
} as const

// function App() {
//     const result = useInfiniteReadContracts({
//         cacheKey: 'mlootAttributes',
//         contracts(pageParam) {
//             const args = [pageParam] as const
//             return [
//                 { ...mlootContractConfig, functionName: 'getChest', args },
//                 { ...mlootContractConfig, functionName: 'getFoot', args },
//                 { ...mlootContractConfig, functionName: 'getHand', args },
//             ]
//         }
//     query: {
//             initialPageParam: 0,
//             getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
//                 return lastPageParam + 1
//             }
//         }
//     })
// }

// const unwatch = watchContractEvent(config, {
//     address: auctionContractAddress,
//     abi: auctionABI,
//     // eventName: 'Transfer',
//     chainId: 31337,
//     // args: {
//     //     to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
//     //   },
//     onLogs(logs) {
//         console.log('New logs!', logs)
//     },
//     poll: true,
//     pollingInterval: 1000,
// })
// unwatch()
