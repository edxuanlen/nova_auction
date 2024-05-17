import { useEffect } from 'react';

import { provider } from '../utils/contract';

function BlockTimestampSync() {

    useEffect(() => {
        if (!provider) return;
        function sleep(ms: number): Promise<void> {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const syncTimestamp = async (blockNumber: number) => {
            const block = await provider.getBlock(blockNumber);
            if (!block) return;
            const blockTimestamp = block.timestamp;
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const difference = blockTimestamp - currentTimestamp;
            const adjustedTimestamp = currentTimestamp + difference;
            updateTimestampDisplay(adjustedTimestamp);
        };

        const updateTimestampDisplay = (timestamp: number) => {
            const date = new Date(timestamp * 1000);
            const formattedDate = date.toLocaleString();
            console.log('Synced Timestamp:', formattedDate);
        };

        let lastExecutionTime = 0;

        const handleNewBlock = (blockNumber: number) => {
            const currentTime = Date.now();
            const timeSinceLastExecution = currentTime - lastExecutionTime;

            if (timeSinceLastExecution >= 5000) {
                syncTimestamp(blockNumber);
                lastExecutionTime = currentTime;
            }
        };

        provider.on('block', handleNewBlock);

        return () => {
            provider.off('block', handleNewBlock);
        };
    }, [provider]);

    return null;
}

export default BlockTimestampSync;
