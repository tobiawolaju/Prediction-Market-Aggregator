import { Router } from 'express';
import { getMarkets } from './services/marketService';
import { getNormalizedEvents } from './services/eventService';

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

router.get('/events/normalized', async (req, res) => {
    try {
        const events = await getNormalizedEvents();
        res.json(events);
    } catch (error) {
        console.error('Error fetching normalized events:', error);
        res.status(500).json({ error: 'Failed to fetch normalized events' });
    }
});

export default router;
