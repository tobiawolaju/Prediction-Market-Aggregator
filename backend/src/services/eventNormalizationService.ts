import crypto from 'crypto';
import { CanonicalEvent, NormalizedEventMarket, EventAggregate, NormalizedEventResponse } from '../models/canonicalEvent';
import { NormalizedMarket } from '../models/normalizedMarket';

/**
 * Generate a stable eventId from normalized question + resolution time
 * @param question - The question text
 * @param resolutionTime - Resolution timestamp or null
 * @returns A stable 16-character hash
 */
export function generateEventId(question: string, resolutionTime: string | null): string {
    const normalized = question.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    const key = `${normalized}-${resolutionTime || 'no-resolution'}`;
    return crypto.createHash('sha256').update(key).digest('hex').substring(0, 16);
}

/**
 * Extract canonical event from a raw market
 * @param market - NormalizedMarket from any source
 * @returns CanonicalEvent
 */
export function extractCanonicalEvent(market: NormalizedMarket): CanonicalEvent {
    const question = market.rawPayload?.question || market.eventKey;
    const resolutionTime = market.rawPayload?.endDate || market.rawPayload?.closeTime || null;
    const category = market.rawPayload?.category || null;

    return {
        eventId: generateEventId(question, resolutionTime),
        canonicalQuestion: question,
        resolutionTime: resolutionTime,
        category: category
    };
}

/**
 * Calculate liquidity-weighted probability and variance
 * @param markets - Array of normalized event markets
 * @returns EventAggregate with weighted probability, variance, and count
 */
export function calculateAggregate(markets: NormalizedEventMarket[]): EventAggregate {
    if (markets.length === 0) {
        return {
            liquidityWeightedProbability: 0,
            probabilityVariance: 0,
            marketCount: 0
        };
    }

    const totalLiquidity = markets.reduce((sum, m) => sum + m.liquidity, 0);

    let weightedProb = 0;
    if (totalLiquidity > 0) {
        weightedProb = markets.reduce((sum, m) => {
            return sum + (m.impliedProbability * m.liquidity);
        }, 0) / totalLiquidity;
    } else {
        // Equal weighting if no liquidity data
        weightedProb = markets.reduce((sum, m) => sum + m.impliedProbability, 0) / markets.length;
    }

    // Calculate variance
    const mean = markets.reduce((sum, m) => sum + m.impliedProbability, 0) / markets.length;
    const variance = markets.reduce((sum, m) => {
        return sum + Math.pow(m.impliedProbability - mean, 2);
    }, 0) / markets.length;

    return {
        liquidityWeightedProbability: weightedProb,
        probabilityVariance: variance,
        marketCount: markets.length
    };
}

/**
 * Group markets by event and create normalized responses
 * @param markets - Array of NormalizedMarket from any source
 * @param adaptMarket - Function to adapt a market to event market format
 * @returns Array of NormalizedEventResponse
 */
export function groupMarketsByEvent(
    markets: NormalizedMarket[],
    adaptMarket: (m: NormalizedMarket) => NormalizedEventMarket
): NormalizedEventResponse[] {
    const eventMap = new Map<string, {
        event: CanonicalEvent;
        markets: NormalizedEventMarket[];
    }>();

    // Group markets by eventId
    markets.forEach(market => {
        const event = extractCanonicalEvent(market);
        const normalizedMarket = adaptMarket(market);

        if (!eventMap.has(event.eventId)) {
            eventMap.set(event.eventId, {
                event,
                markets: []
            });
        }

        eventMap.get(event.eventId)!.markets.push(normalizedMarket);
    });

    // Create responses with aggregates
    return Array.from(eventMap.values()).map(({ event, markets }) => ({
        event,
        markets,
        aggregate: calculateAggregate(markets)
    }));
}
