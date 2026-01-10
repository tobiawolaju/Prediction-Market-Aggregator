// Run with: npx ts-node scripts/test_fetch.ts
import { getMarkets } from '../src/services/marketService';

async function main() {
    console.log('Fetching Kalshi markets...');
    const kalshi = await getMarkets('kalshi');
    console.log(`Fetched ${kalshi.length} Kalshi markets.`);
    if (kalshi.length > 0) {
        console.log('Sample Kalshi:', JSON.stringify(kalshi[0], null, 2));
    }

    console.log('\nFetching Polymarket markets...');
    const polymarket = await getMarkets('polymarket');
    console.log(`Fetched ${polymarket.length} Polymarket markets.`);
    if (polymarket.length > 0) {
        console.log('Sample Polymarket:', JSON.stringify(polymarket[0], null, 2));
    }
}

main().catch(console.error);
