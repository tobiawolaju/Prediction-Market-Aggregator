import { Router } from 'express';
import { getMarkets } from './services/marketService';

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

import { normalizationService } from './services/normalizationService';

router.get('/events/normalized', async (req, res) => {
    try {
        const events = await normalizationService.fetchAndNormalize();
        res.json({
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error("Error in normalized endpoint:", error);
        res.status(500).json({ error: 'Failed to normalize events' });
    }
});

export default router;
