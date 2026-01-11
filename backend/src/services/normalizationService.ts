import { getMarkets } from './marketService';
import { NormalizedMarket } from '../models/normalizedMarket';
import { CanonicalEvent, AggregatedStats } from '../models/canonicalEvent';
import * as CryptoJS from 'crypto-js';

export class NormalizationService {

    async fetchAndNormalize(): Promise<{ event: CanonicalEvent, markets: NormalizedMarket[], aggregate: AggregatedStats }[]> {
        const MARKETS_TO_FETCH: ("polymarket" | "manifold")[] = ["polymarket", "manifold"];
        let allMarkets: NormalizedMarket[] = [];

        try {
            // Fetch from supported sources
            const results = await Promise.all(
                MARKETS_TO_FETCH.map(source => getMarkets(source))
            );
            allMarkets = results.flat();
        } catch (error) {
            console.error("Error fetching markets for normalization:", error);
            return [];
        }

        // Group markets into events
        const groupedEvents = this.groupEvents(allMarkets);

        // Aggregate stats for each event
        return groupedEvents.map(event => ({
            event: event,
            markets: event.markets,
            aggregate: event.aggregate
        }));
    }

    private groupEvents(markets: NormalizedMarket[]): CanonicalEvent[] {
        const eventsMap: { [key: string]: CanonicalEvent } = {};

        markets.forEach(market => {
            const canonicalQuestion = this.normalizeQuestion(market.eventKey);
            // Polymarket and Manifold might have different ways to guess resolution time if not explicit.
            // For now, we mix it into the ID generation or strictly use Question Text grouping.
            // Using logic: ID = SHA256(canonicalQuestion) for stronger grouping across platforms.

            const eventId = CryptoJS.SHA256(canonicalQuestion).toString();

            if (!eventsMap[eventId]) {
                eventsMap[eventId] = {
                    eventId: eventId,
                    canonicalQuestion: market.eventKey, // Keep separate real question mapping if needed
                    resolutionTime: null, // Would need extraction/parsing logic
                    markets: [],
                    aggregate: {
                        liquidityWeightedProbability: 0,
                        probabilityVariance: 0,
                        marketCount: 0
                    }
                };
            }

            eventsMap[eventId].markets.push(market);
        });

        const events = Object.values(eventsMap);

        // Compute aggregates
        events.forEach(event => {
            event.aggregate = this.calculateAggregates(event.markets);
        });

        // Filter out single-market events if we ONLY want cross-market ones? 
        // User requirements say "groups markets referring to the same real-world event", 
        // implies we show everything but grouped.

        return events;
    }

    private normalizeQuestion(text: string): string {
        // Basic normalization: lowercase, alphanumeric only
        return text.toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    private calculateAggregates(markets: NormalizedMarket[]): AggregatedStats {
        let totalLiquidity = 0;
        let weightedProbSum = 0;
        const probs: number[] = [];

        markets.forEach(m => {
            if (m.liquidity > 0) {
                totalLiquidity += m.liquidity;
                weightedProbSum += m.impliedProbability * m.liquidity;
            }
            probs.push(m.impliedProbability);
        });

        const weightedProb = totalLiquidity > 0 ? weightedProbSum / totalLiquidity :
            (probs.reduce((a, b) => a + b, 0) / probs.length); // Fallback to simple average

        // Variance
        const mean = probs.reduce((a, b) => a + b, 0) / probs.length;
        const variance = probs.length > 1 ?
            probs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / probs.length : 0;

        return {
            liquidityWeightedProbability: weightedProb,
            probabilityVariance: variance,
            marketCount: markets.length
        };
    }
}

export const normalizationService = new NormalizationService();
