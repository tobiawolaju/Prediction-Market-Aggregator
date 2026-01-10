import { fetchKalshiMarkets } from '../adapters/kalshi';
import { fetchPolymarketMarkets } from '../adapters/polymarket';
import { fetchRobinhoodMarkets } from '../adapters/robinhood';
import { NormalizedMarket } from '../models/normalizedMarket';

export async function getMarkets(source?: 'kalshi' | 'polymarket' | 'robinhood'): Promise<NormalizedMarket[]> {
    if (source === 'kalshi') {
        return await fetchKalshiMarkets();
    } else if (source === 'polymarket') {
        return await fetchPolymarketMarkets();
    } else if (source === 'robinhood') {
        return await fetchRobinhoodMarkets();
    } else {
        // Fetch all
        const [kalshi, polymarket, robinhood] = await Promise.all([
            fetchKalshiMarkets(),
            fetchPolymarketMarkets(),
            fetchRobinhoodMarkets()
        ]);
        return [...kalshi, ...polymarket, ...robinhood];
    }
}
