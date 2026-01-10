import { fetchPolymarketMarkets } from '../adapters/polymarket';
import { fetchManifoldMarkets } from '../adapters/manifold';
import { adaptPolymarketToEventMarket } from '../adapters/polymarketEventAdapter';
import { adaptManifoldToEventMarket } from '../adapters/manifoldEventAdapter';
import { groupMarketsByEvent } from './eventNormalizationService';
import { NormalizedEventResponse } from '../models/canonicalEvent';

/**
 * Fetch and normalize events from all prediction market sources
 * @returns Array of normalized events with grouped markets and aggregates
 */
export async function getNormalizedEvents(): Promise<NormalizedEventResponse[]> {
    // Fetch from both sources in parallel
    const [polymarketMarkets, manifoldMarkets] = await Promise.all([
        fetchPolymarketMarkets(),
        fetchManifoldMarkets()
    ]);

    // Combine all markets
    const allMarkets = [...polymarketMarkets, ...manifoldMarkets];

    // Group and normalize using appropriate adapter for each source
    const events = groupMarketsByEvent(allMarkets, (market) => {
        if (market.source === 'polymarket') {
            return adaptPolymarketToEventMarket(market);
        } else {
            return adaptManifoldToEventMarket(market);
        }
    });

    return events;
}
