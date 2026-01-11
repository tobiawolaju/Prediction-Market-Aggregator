import { CategoryRule, MarketClaim } from './types';

// Helper regex patterns
const RE_ETH = /\b(eth|ethereum)\b/i;
const RE_BTC = /\b(btc|bitcoin)\b/i;
const RE_PRICE = /\$?([\d,]+\.?\d*)/; // captures numbers like 2000, $2,000.50
const RE_ABOVE = /\b(above|>=|greater|more than|exceed|over)\b/i;
const RE_BELOW = /\b(below|<=|less than|under)\b/i;
const RE_ELECTION = /\b(election|president|win|advanced to|qualify|be charged|dead|protests)\b/i;
const RE_SPORTS = /\b(nba|nfl|mlb|nhl|beat|lose|versus|vs|points|gross|grosses|tournament|semifinals|winner|podium|medal|athlete)\b/i;
const RE_COMMODITY = /\b(natural gas|oil|gold|silver|stock|share|price of)\b/i;

// Mapping of entity strings to canonical identifiers
const ENTITY_MAP: Record<string, string> = {
    'donald trump': 'DONALD_TRUMP',
    'trump': 'DONALD_TRUMP',
    'kamala harris': 'KAMALA_HARRIS',
    'harris': 'KAMALA_HARRIS',
    'biden': 'JOE_BIDEN',
    'gop': 'REPUBLICAN_PARTY',
    'democrats': 'DEMOCRATIC_PARTY',
    'republican': 'REPUBLICAN_PARTY',
    'democrat': 'DEMOCRATIC_PARTY',
};

export const Rules: Record<string, CategoryRule> = {
    // Crypto price thresholds
    CRYPTO_PRICE: {
        detect: (q: string) => (RE_ETH.test(q) || RE_BTC.test(q)) && RE_PRICE.test(q) && (RE_ABOVE.test(q) || RE_BELOW.test(q)),
        extract: (q: string, raw: any) => {
            const subject = RE_ETH.test(q) ? 'ETH_PRICE' : 'BTC_PRICE';
            const metric = 'price_usd';
            let operator: MarketClaim['operator'] = '>=';
            if (RE_BELOW.test(q)) operator = '<';
            const match = q.match(RE_PRICE);
            if (!match) return null;
            const val = parseFloat(match[1].replace(/,/g, ''));
            return { subject, metric, operator, threshold: val, eventScope: 'GLOBAL' };
        },
    },

    // US politics winner predictions
    US_POLITICS: {
        detect: (q: string) => RE_ELECTION.test(q) && Object.keys(ENTITY_MAP).some(k => q.toLowerCase().includes(k)) && !/\b(dead|death|mortality)\b/i.test(q),
        extract: (q: string, raw: any) => {
            const lower = q.toLowerCase();
            const key = Object.keys(ENTITY_MAP).find(k => lower.includes(k));
            if (!key) return null;
            return {
                subject: 'US_PRES_ELECTION_2024',
                metric: 'winner',
                operator: '==',
                threshold: ENTITY_MAP[key],
                eventScope: 'US_PRES_ELECTION_2024'
            };
        },
    },

    // Sports (NBA/NFL/Soccer) - detecting winner/spread
    SPORTS_MATCH: {
        detect: (q: string) => RE_SPORTS.test(q) && (/\b(beat|win|vs|winner|qualify)\b/i.test(q)),
        extract: (q: string, raw: any) => {
            const matchSpread = q.match(/by more than ([\d,.]+) points/i);
            const threshold = matchSpread ? parseFloat(matchSpread[1]) : 'WINNER';
            const metric = matchSpread ? 'point_spread' : 'match_winner';
            const operator = matchSpread ? '>' : '==';

            // Extract potential subject (team name)
            const subjectMatch = q.match(/Will the (.*?) beat/i) || q.match(/Who will win (.*?) vs/i) || q.match(/Will (.*?) win/i);
            const subjectStr = subjectMatch ? subjectMatch[1].trim().toUpperCase().replace(/\s+/g, '_') : 'SPORTS_EVENT';

            // Tier 1 - Event Scope Extraction (Deterministic)
            let league = 'GENERIC';
            if (/\b(nba)\b/i.test(q)) league = 'NBA';
            if (/\b(nfl)\b/i.test(q)) league = 'NFL';
            if (/\b(soccer|champions league|euro 2020|laliga|premier league)\b/i.test(q)) league = 'SOCCER';

            // Extract year if present
            const yearMatch = q.match(/\b(202\d)\b/);
            const year = yearMatch ? yearMatch[1] : '2024'; // Default to current/near year if not found

            // Participant normalization (very basic for now)
            // Ideally we'd extract both teams and sort them alphabetically for the scope
            // For now, we use the primary subject and search for a secondary "vs" or "against"
            const vsMatch = q.match(/vs\.?\s+([^?,\s]+)/i) || q.match(/beat\s+the\s+([^?,\s]+)/i);
            const opponent = vsMatch ? vsMatch[1].trim().toUpperCase().replace(/\s+/g, '_') : 'UNKNOWN';

            const participants = [subjectStr, opponent].sort();
            const eventScope = `${league.toLowerCase()}_${year}_${participants[0].toLowerCase()}_${participants[1].toLowerCase()}`;

            return {
                subject: `SPORTS_${subjectStr}`,
                metric,
                operator,
                threshold,
                eventScope
            };
        },
    },

    // Commodities and Stocks
    ECONOMICS: {
        detect: (q: string) => RE_COMMODITY.test(q) && RE_PRICE.test(q),
        extract: (q: string, raw: any) => {
            const match = q.match(RE_PRICE);
            if (!match) return null;
            const threshold = parseFloat(match[1].replace(/,/g, ''));

            let subject = 'COMMODITY';
            if (/natural gas/i.test(q)) subject = 'NATURAL_GAS_PRICE';
            if (/intel/i.test(q)) subject = 'INTEL_STOCK_PRICE';

            let operator: MarketClaim['operator'] = '==';
            if (RE_ABOVE.test(q)) operator = '>=';
            if (RE_BELOW.test(q)) operator = '<=';

            return { subject, metric: 'price_usd', operator, threshold, eventScope: 'GLOBAL' };
        },
    },

    // Pop Culture (Box Office, Steam)
    POP_CULTURE: {
        detect: (q: string) => (/\b(gross|million|steam|most played|opened|weekend)\b/i.test(q)) && RE_PRICE.test(q),
        extract: (q: string, raw: any) => {
            const match = q.match(RE_PRICE);
            if (!match) return null;
            const threshold = parseFloat(match[1].replace(/,/g, ''));

            let metric = 'box_office_usd';
            if (/\b(steam|player|played)\b/i.test(q)) metric = 'peak_player_count';

            let operator: MarketClaim['operator'] = '>=';
            if (RE_BELOW.test(q)) operator = '<=';

            return { subject: 'POP_CULTURE_EVENT', metric, operator, threshold, eventScope: 'POP_CULTURE_GLOBAL' };
        },
    }
};
