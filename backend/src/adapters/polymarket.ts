import axios from 'axios';


const CLOB_API_URL = 'https://clob.polymarket.com'; // or Gamma Markets API https://gamma-api.polymarket.com/

export async function fetchPolymarketMarkets(): Promise<any[]> {
    try {
        // Using Gamma Markets API (likely structure)
        // Querying for active markets
        const url = `https://gamma-api.polymarket.com/events?limit=20&active=true`;

        const response = await axios.get(url);
        const events = response.data || [];

        const normalized: any[] = [];

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
                    liquidity: Number(m.volume) || 0,
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
