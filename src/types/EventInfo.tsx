
export type EventInfo = {
    eventType: string;
    address: string;
    pointType: bigint;
    bidPrice: bigint;
    bidPoints: bigint;
    transactionTime?: Date;
};

export type EarningInfo = {
    EarnAmount: number;
    EarnTime: Date;
}
