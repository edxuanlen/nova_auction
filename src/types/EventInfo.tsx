
type EventInfo = {
    eventType: string;
    address: string;
    pointType: bigint;
    bidAmount: bigint;
    bidPoints: bigint;
    transactionTime?: Date;
};

export default EventInfo;
