import { getMarkets } from './src/services/marketService';
import { Canonizer } from './src/models/canonizer';
import { Aggregator } from './src/models/aggregator';
import * as fs from 'fs';

async function run() {
    try {
        const poly = await getMarkets('polymarket');
        const mani = await getMarkets('manifold');
        const c = new Canonizer();
        const a = new Aggregator();
        const claims = [
            ...c.normalize(poly, 'polymarket'),
            ...c.normalize(mani, 'manifold')
        ];
        const events = a.aggregate(claims);
        fs.writeFileSync('output_scope.json', JSON.stringify(events, null, 2), 'utf8');
        console.log('Success: output_scope.json created');
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}
run();
