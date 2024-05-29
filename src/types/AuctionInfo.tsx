export enum AuctionType {
    EzPoints,
    ElPoints,
}

export type AuctionInfo = {
    startTime: Date;
    endTime: Date;
    pointsType: AuctionType;
    pointsQuantity: number;
    startingBid: number;
}
