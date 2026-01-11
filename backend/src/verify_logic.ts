import { Canonizer } from './models/canonizer';
import { Aggregator } from './models/aggregator';
import fs from 'fs';
import path from 'path';

async function verify() {
    try {
        const canonizer = new Canonizer();
        const aggregator = new Aggregator();

        // Load sample data
        const polyPath = path.join(__dirname, '../scripts/endpointsresponse/markets_polymarket.json');
        const maniPath = path.join(__dirname, '../scripts/endpointsresponse/markets_manifold.json');

        const polyData = JSON.parse(fs.readFileSync(polyPath, 'utf-8'));
        const maniData = JSON.parse(fs.readFileSync(maniPath, 'utf-8'));

        // Normalize
        console.log('Normalizing Polymarket data...');
        const claimsPoly = canonizer.normalize(polyData, 'polymarket');
        console.log(`Extracted ${claimsPoly.length} claims from Polymarket.`);

        console.log('Normalizing Manifold data...');
        const claimsMani = canonizer.normalize(maniData, 'manifold');
        console.log(`Extracted ${claimsMani.length} claims from Manifold.`);

        const allClaims = [...claimsPoly, ...claimsMani];

        // Aggregate
        console.log('Aggregating claims...');
        const events = aggregator.aggregate(allClaims);
        console.log(`Generated ${events.length} canonical events.`);

        if (events.length > 0) {
            console.log('Sample Event:', JSON.stringify(events[0], null, 2));
        } else {
            console.log('No events generated. Check rules or data.');
        }

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verify();
