import { NormalizedEventMarket } from '../models/canonicalEvent';

/**
 * Adapts a Polymarket normalized market to the event-centric market model
 * @param rawMarket - NormalizedMarket from Polymarket
 * @returns NormalizedEventMarket
 */
export function adaptPolymarketToEventMarket(rawMarket: any): NormalizedEventMarket {
    return {
        source: 'polymarket',
        marketId: rawMarket.marketId || rawMarket.id,
        outcome: rawMarket.outcome || 'YES',
        impliedProbability: Number(rawMarket.impliedProbability) || 0.5,
        liquidity: Number(rawMarket.liquidity) || 0,
        lastUpdated: rawMarket.rawPayload?.updatedAt || new Date().toISOString(),
        rawPayload: rawMarket.rawPayload || rawMarket
    };
}
