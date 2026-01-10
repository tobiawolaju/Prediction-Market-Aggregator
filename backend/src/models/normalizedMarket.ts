export interface NormalizedMarket {
    source: "kalshi" | "polymarket" | "robinhood";
    marketId: string;
    eventKey: string;           // canonical event identifier
    outcome: string;            // e.g., YES / NO / outcomes[ ]
    impliedProbability: number; // 0.0 – 1.0
    price?: number;             // For non-probability markets (e.g. crypto)
    liquidity?: number;         // raw liquidity
    spread?: number;            // optional bid-ask spread
    rawPayload: any;            // original API response
}
