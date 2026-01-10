// Run with: npx ts-node scripts/test_kalshi.ts
import { fetchKalshiMarkets } from '../src/adapters/kalshi';

async function main() {
    console.log('Fetching Kalshi markets...');

    try {
        const markets = await fetchKalshiMarkets();

        console.log(`Successfully fetched ${markets.length} Kalshi markets.`);

        if (markets.length > 0) {
            console.log('Sample Market Data:');
            console.log(JSON.stringify(markets[0], null, 2));
        } else {
            console.log('No markets found. Check API keys and endpoint.');
        }
    } catch (error) {
        console.error('Failed to run Kalshi test:', error);
    }
}

main();
