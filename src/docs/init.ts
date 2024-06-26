// import Introduction from '../docs/1.md';
// import NovaEarn from '../docs/3.md';
// import NovaAuction from '../docs/4.md';

import Earn from './Aspose.Words.895f1159-2aac-4bf4-8779-51d3028c6792.001.png';
import Supply from './Aspose.Words.895f1159-2aac-4bf4-8779-51d3028c6792.002.png';
import EarningRecord from './Aspose.Words.895f1159-2aac-4bf4-8779-51d3028c6792.003.png';
import Auction from './Aspose.Words.895f1159-2aac-4bf4-8779-51d3028c6792.004.png';
import Bid from './Aspose.Words.895f1159-2aac-4bf4-8779-51d3028c6792.005.png';

export const IntroductionMD = `# **Introduction to Nova**

## **What is Nova?**

Nova is your gateway to maximizing your yield potential in the ever-evolving world of decentralized finance. We empower users by providing complete control over their yield, enabling them to thrive in both bullish and bearish markets. Nova is a groundbreaking, permissionless yield-trading protocol that allows users to sell their token points for earnings. Our innovative platform ensures that users can effortlessly optimize their returns with ease.

## **How Does Nova Work?**

### 1. Sell Points for Daily Earnings

With Nova, you can deposit ezETH, and our platform will auction off the points generated by your ezETH. The proceeds from these auctions are distributed among all depositors, providing you with consistent daily earnings. You can withdraw both your principal and any accrued earnings at any time after a one-day deposit. This means you can relax and watch your earnings grow daily with Nova.

### 2. Obtain Points through Auction

Alternatively, you can use ezETH to participate in auctions for ezpoints and elpoints. This allows you to acquire a significant number of points directly, without needing to hold ezETH for a prolonged period. By participating in these auctions, you can optimize your yield and increase your earnings potential.


## **Why Choose Nova?**

- **Permissionless Trading:** Trade without restrictions and take full control of your yield.
- **Daily Earnings**: Enjoy the benefits of daily earnings with flexible withdrawal options.
- **Efficient Yield Management**: Easily manage and optimize your yield through our user-friendly platform.
- **Transparent and Secure:** Experience a secure trading environment with transparent processes.


## **Advanced Yield Strategies with Nova**

At Nova, we unlock the full potential of your yield by enabling you to execute advanced yield strategies, such as:
- **Fixed Yield:** Earn a stable return on your ezETH.
- **Yield Maximization:** Increase your yield exposure in bullish markets by acquiring more points.
- **Risk-Free Yield Enhancement:** Provide liquidity with your ezETH and earn additional yield without extra risk.


## **Join Nova Today**

Take the reins of your financial future with Nova. Maximize your yield effortlessly and enjoy the freedom to trade and earn on your terms.

`;


export const NovaEarnMD = `# **Nova Earn: Maximize Your Earnings with Ease**

## **Enabling Nova Earn**

To start earning with Nova Earn, follow these simple steps:

1. **Activate Nova Earn:** Click the 'Earn' button on the app.

    ![](${Earn})

2. **Supply ezETH:** Provide ezETH and begin earning immediately.

    ![](${Supply})

## **About Nova Earn**

Nova Earn is designed to help you maximize your earnings effortlessly. Here’s how it works:

- **Auction Mechanism:** Nova will auction the points generated by the supply of ezETH.
- **Earnings Distribution**: Currently, 100% of the ezETH acquired through the auction will be distributed among all depositors. In the future, 90% of the earnings will continue to be distributed to depositors, while 10% will be allocated to the Nova DAO to support the ecosystem.

## **Monitor Your Earnings**

Stay updated with your earnings:

- **Check Earnings Post-Auction:** After each auction, you can easily check your accumulated earnings directly within the app.
    ![](${EarningRecord})
`;




export const NovaAuctionMD = `
# **Nova Auction: Unlock New Earning Opportunities**

## **Enabling Nova Auction**

To start participating in Nova Auction, follow these simple steps:

1.  **Activate Nova Auction:** Click the 'Auction' button on the app.

    ![](${Auction})

2.  **Choose Point Type:** Select the type of points you want to auction (you can auction ez points and el points on Nova).

    ![](${Bid})

## **How Nova Auction Works**
1. **Place Your Bid:** Once the auction starts, place your bid. Successful bids will earn you points.
2. **Blind Bidding System:** Nova Auction uses a blind bidding system, meaning you cannot see other participants' bids, and they cannot see yours. Confirm your bidding price and quantity, then proceed with the bidding.

## **Understanding Nova Auction**

You can auction ez points or el points with Nova Auction. Here's how it works:

- **Blind Bidding**: Submit your bid without knowing others' bids. This ensures a fair and competitive bidding process.
- **Winning and Refunds**: After the auction, the highest bidders win. The final transaction price is the lowest price among the successful bidders, and Nova will refund any excess amount.

### **Example Scenario:**

- Total Auction Units: 100 units
- Bidders:
  - A: Purchases 50 units at 0.2 ezETH per unit
  - B: Purchases 50 units at 0.1 ezETH per unit
  - C: Purchases 50 units at 0.05 ezETH per unit
- Results:
  - A wins the bid and receives a refund of 5 ezETH (50 units \* (0.2 - 0.1) ezETH).
  - B wins the bid.
  - C fails to win the bid and receives a refund of 2.5 ezETH (50 units \* 0.05 ezETH).

## **Why Choose Nova Auction?**

- **Fair and Transparent:** Enjoy a blind bidding system that ensures fairness and competitiveness.
- **Maximize Earnings:** Participate in auctions to earn points and enhance your yield.
- **User-Friendly**: Easily place bids and track your auction results within the app.

Join Nova Auction today and unlock new earning opportunities with ease and transparency.

`;
