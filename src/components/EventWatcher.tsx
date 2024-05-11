import { watchContractEvent } from '@wagmi/core'
import { auctionABI, auctionContractAddress, ezETHContractAddress } from '../utils/contract'
import { config } from '../config'

import { useInfiniteReadContracts } from 'wagmi'

