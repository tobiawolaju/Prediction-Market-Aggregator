import { fetchKalshiMarkets } from '../adapters/kalshi';
import { fetchPolymarketMarkets } from '../adapters/polymarket';
import { NormalizedMarket } from '../models/normalizedMarket';

export async function getMarkets(source?: 'kalshi' | 'polymarket'): Promise<NormalizedMarket[]> {
    if (source === 'kalshi') {
        return await fetchKalshiMarkets();
    } else if (source === 'polymarket') {
        return await fetchPolymarketMarkets();
    } else {
        // Fetch all
        const [kalshi, polymarket] = await Promise.all([
            fetchKalshiMarkets(),
            fetchPolymarketMarkets()
        ]);
        return [...kalshi, ...polymarket];
    }
}
