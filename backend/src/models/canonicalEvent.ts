import { NormalizedMarket } from './normalizedMarket';

export interface AggregatedStats {
    liquidityWeightedProbability: number;
    probabilityVariance: number;
    marketCount: number;
}

export interface CanonicalEvent {
    eventId: string;
    canonicalQuestion: string;
    resolutionTime: string | null;
    category?: string;
    markets: NormalizedMarket[];
    aggregate: AggregatedStats;
}
