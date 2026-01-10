import { NormalizedEventMarket } from '../models/canonicalEvent';

/**
 * Adapts a Manifold normalized market to the event-centric market model
 * @param rawMarket - NormalizedMarket from Manifold
 * @returns NormalizedEventMarket
 */
export function adaptManifoldToEventMarket(rawMarket: any): NormalizedEventMarket {
    return {
        source: 'manifold',
        marketId: rawMarket.marketId || rawMarket.id,
        outcome: rawMarket.outcome || 'YES',
        impliedProbability: Number(rawMarket.impliedProbability) || 0.5,
        liquidity: Number(rawMarket.liquidity) || 0,
        lastUpdated: rawMarket.rawPayload?.lastUpdatedTime
            ? new Date(rawMarket.rawPayload.lastUpdatedTime).toISOString()
            : new Date().toISOString(),
        rawPayload: rawMarket.rawPayload || rawMarket
    };
}
