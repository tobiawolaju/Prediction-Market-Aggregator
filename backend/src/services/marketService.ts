import { fetchKalshiMarkets } from '../adapters/kalshi';
import { fetchPolymarketMarkets } from '../adapters/polymarket';
import { fetchRobinhoodMarkets } from '../adapters/robinhood';
import { fetchManifoldMarkets } from '../adapters/manifold';

export async function getMarkets(source?: 'kalshi' | 'polymarket' | 'robinhood' | 'manifold'): Promise<any[]> {
    if (source === 'kalshi') {
        return await fetchKalshiMarkets();
    } else if (source === 'polymarket') {
        return await fetchPolymarketMarkets();
    } else if (source === 'robinhood') {
        return await fetchRobinhoodMarkets();
    } else if (source === 'manifold') {
        return await fetchManifoldMarkets();
    } else {
        // Fetch all
        const [kalshi, polymarket, robinhood, manifold] = await Promise.all([
            fetchKalshiMarkets(),
            fetchPolymarketMarkets(),
            fetchRobinhoodMarkets(),
            fetchManifoldMarkets()
        ]);
        return [...kalshi, ...polymarket, ...robinhood, ...manifold];
    }
}
