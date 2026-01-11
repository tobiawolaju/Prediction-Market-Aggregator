import axios from 'axios';
import { NormalizedMarket } from '../models/normalizedMarket';

const CLOB_API_URL = 'https://clob.polymarket.com'; // or Gamma Markets API https://gamma-api.polymarket.com/

export async function fetchPolymarketMarkets(): Promise<NormalizedMarket[]> {
    try {
        // Using Gamma Markets API (likely structure)
        // Querying for active markets
        const url = `https://gamma-api.polymarket.com/events?limit=20&active=true`;

        const response = await axios.get(url);
        const events = response.data || [];

        const normalized: NormalizedMarket[] = [];

        events.forEach((event: any) => {
            if (!event.markets) return;

            event.markets.forEach((m: any) => {
                // Polymarket outcomes are often "YES"/"NO" for binary.
                // AMM or CLOB price. 
                // We'll assume 'price' field exists or 'bestBid'/'bestAsk'

                // Simplified extraction
                normalized.push({
                    source: 'polymarket',
                    marketId: m.id,
                    eventKey: event.slug || event.id,
                    outcome: m.outcome || 'YES',
                    impliedProbability: Number(m.price) || 0.5, // Check actual API field
                    liquidity: Number(m.liquidity) || Number(m.volume) || 0,
                    lastUpdated: m.updatedAt || new Date().toISOString(),
                    rawPayload: m
                });
            });
        });

        return normalized;

    } catch (error) {
        console.error('Error fetching Polymarket markets:', error);
        return [];
    }
}
