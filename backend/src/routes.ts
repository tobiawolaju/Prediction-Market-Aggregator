import { Router } from 'express';
import { getMarkets } from './services/marketService';
import { Canonizer } from './models/canonizer';
import { Aggregator } from './models/aggregator';

const router = Router();

router.get('/markets/kalshi', async (req, res) => {
    try {
        const markets = await getMarkets('kalshi');
        res.json(markets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Kalshi markets' });
    }
});

router.get('/markets/polymarket', async (req, res) => {
    try {
        const markets = await getMarkets('polymarket');
        res.json(markets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Polymarket markets' });
    }
});

router.get('/markets/robinhood', async (req, res) => {
    try {
        const markets = await getMarkets('robinhood');
        res.json(markets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Robinhood markets' });
    }
});

router.get('/markets/manifold', async (req, res) => {
    try {
        const markets = await getMarkets('manifold');
        res.json(markets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Manifold markets' });
    }
});

router.get('/markets/all', async (req, res) => {
    try {
        const markets = await getMarkets();
        res.json(markets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all markets' });
    }
});

router.get('/events/marketclaims', async (req, res) => {
    try {
        const polymarket = await getMarkets('polymarket');
        const manifold = await getMarkets('manifold');
        const canonizer = new Canonizer();

        const claims = [
            ...canonizer.normalize(polymarket, 'polymarket'),
            ...canonizer.normalize(manifold, 'manifold')
        ];

        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate market claims' });
    }
});

router.get('/events/canonical', async (req, res) => {
    try {
        const polymarket = await getMarkets('polymarket');
        const manifold = await getMarkets('manifold');
        const canonizer = new Canonizer();
        const aggregator = new Aggregator();

        const claims = [
            ...canonizer.normalize(polymarket, 'polymarket'),
            ...canonizer.normalize(manifold, 'manifold')
        ];

        const events = aggregator.aggregate(claims);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate canonical events' });
    }
});

export default router;
