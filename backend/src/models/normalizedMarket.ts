export interface NormalizedMarket {
    source: "kalshi" | "polymarket";
    marketId: string;
    eventKey: string;           // canonical event identifier
    outcome: string;            // e.g., YES / NO / outcomes[ ]
    impliedProbability: number; // 0.0 – 1.0
    liquidity?: number;         // raw liquidity
    spread?: number;            // optional bid-ask spread
    rawPayload: any;            // original API response
}
