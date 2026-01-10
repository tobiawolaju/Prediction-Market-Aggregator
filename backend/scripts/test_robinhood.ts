// Run with: npx ts-node scripts/test_robinhood.ts
import { fetchRobinhoodMarkets } from '../src/adapters/robinhood';

async function main() {
    console.log('Fetching Robinhood markets (Crypto)...');

    try {
        const markets = await fetchRobinhoodMarkets();

        console.log(`Successfully fetched ${markets.length} Robinhood markets.`);

        if (markets.length > 0) {
            console.log('Sample Market Data:');
            console.log(JSON.stringify(markets[0], null, 2));
        } else {
            console.log('No markets found.');
        }
    } catch (error) {
        console.error('Failed to run Robinhood test:', error);
    }
}

main();
