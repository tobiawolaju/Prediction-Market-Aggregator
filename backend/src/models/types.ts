export interface MarketClaim {
    claimId: string; // hash(source + marketId)
    // Semantic Core
    subject: string; // e.g., "ETH", "US_PRES_ELECTION_2024"
    metric: string; // e.g., "price_usd", "winner"
    operator: '==' | '>' | '>=' | '<' | '<=';
    threshold: string | number; // e.g., 2000, "YES"
    eventScope: string; // unique identifier for the real-world fixture (e.g., "nba_2024_mavs_grizzlies")

    // Constraints
    deadline: string; // ISO date string
    resolutionSource: string; // e.g., "coinbase", "AP"

    // Evidence
    source: 'polymarket' | 'manifold' | 'kalshi' | 'robinhood';
    marketId: string;
    originalQuestion: string;
    url: string;
}

export interface CanonicalEvent {
    eventID: string; // deterministic hash
    subject: string;
    metric: string;
    operator: string;
    threshold: string | number;
    eventScope: string;
    earliestDeadline: string; // min deadline among grouped claims
    consensusSource: string; // chosen resolution source
    markets: Array<{
        source: string;
        marketId: string;
        url: string;
        deadline: string;
    }>;
}

export type CategoryRule = {
    detect: (question: string, raw: any) => boolean;
    extract: (question: string, raw: any) => Partial<MarketClaim> | null;
};
