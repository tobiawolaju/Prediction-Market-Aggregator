export interface CanonicalEvent {
    eventId: string;
    canonicalQuestion: string;
    resolutionTime: string | null;
    category: string | null;
}

export interface NormalizedEventMarket {
    source: 'polymarket' | 'manifold';
    marketId: string;
    outcome: string;
    impliedProbability: number;
    liquidity: number;
    lastUpdated: string;
    rawPayload: any;
}

export interface EventAggregate {
    liquidityWeightedProbability: number;
    probabilityVariance: number;
    marketCount: number;
}

export interface NormalizedEventResponse {
    event: CanonicalEvent;
    markets: NormalizedEventMarket[];
    aggregate: EventAggregate;
}
