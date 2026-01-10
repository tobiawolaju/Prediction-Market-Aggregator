// Run with: npx ts-node scripts/test_manifold.ts
import { fetchManifoldMarkets } from '../src/adapters/manifold';

async function main() {
    console.log('Fetching Manifold Markets (no API key required)...');

    try {
        const markets = await fetchManifoldMarkets();

        console.log(`Successfully fetched ${markets.length} Manifold markets.`);

        if (markets.length > 0) {
            console.log('\nSample Market Data:');
            console.log(JSON.stringify(markets[0], null, 2));

            console.log('\nFirst 5 markets:');
            markets.slice(0, 5).forEach((m, i) => {
                console.log(`${i + 1}. ${m.eventKey} - Probability: ${(m.impliedProbability * 100).toFixed(1)}%`);
            });
        } else {
            console.log('No markets found.');
        }
    } catch (error) {
        console.error('Failed to run Manifold test:', error);
    }
}

main();
