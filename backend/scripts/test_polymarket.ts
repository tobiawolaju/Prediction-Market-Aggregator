// Run with: npx ts-node scripts/test_polymarket.ts
import { fetchPolymarketMarkets } from '../src/adapters/polymarket';

async function main() {
    console.log('Fetching Polymarket markets from public Gamma API...');

    try {
        const markets = await fetchPolymarketMarkets();

        console.log(`Successfully fetched ${markets.length} Polymarket markets.`);

        if (markets.length > 0) {
            console.log('Sample Market Data:');
            console.log(JSON.stringify(markets[0], null, 2));
        } else {
            console.log('No markets found. Check API endpoint or availability.');
        }
    } catch (error) {
        console.error('Failed to run Polymarket test:', error);
    }
}

main();
