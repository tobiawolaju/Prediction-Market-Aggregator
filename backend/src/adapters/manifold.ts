import axios from 'axios';
import { NormalizedMarket } from '../models/normalizedMarket';

const MANIFOLD_API_URL = 'https://api.manifold.markets/v0';

export async function fetchManifoldMarkets(): Promise<NormalizedMarket[]> {
  try {
    // Fetch active markets from Manifold
    // No auth required for public market data
    const url = `${MANIFOLD_API_URL}/markets?limit=100&sort=created-time&order=desc`;
    
    const response = await axios.get(url);
    const markets = response.data || [];
    
    return markets
      .filter((m: any) => !m.isResolved && m.outcomeType === 'BINARY') // Only active binary markets
      .map((m: any) => ({
        source: 'manifold',
        marketId: m.id,
        eventKey: m.url?.split('/').pop() || m.id, // Use slug from URL or ID
        outcome: 'YES', // Binary markets
        impliedProbability: m.probability || 0.5,
        liquidity: m.totalLiquidity || m.volume || 0,
        rawPayload: m
      }));

  } catch (error) {
    console.error('Error fetching Manifold markets:', error);
    return [];
  }
}
