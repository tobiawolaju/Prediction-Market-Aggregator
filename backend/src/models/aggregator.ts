import crypto from 'crypto';
import { MarketClaim, CanonicalEvent } from './types';

export class Aggregator {
    /** Generate Semantic Grouping Key based on semantic core + eventScope */
    private getSemanticGroupingKey(claim: MarketClaim): string {
        // If it's a match_winner metric with an unspecified event, it must never be merged.
        if (claim.metric === 'match_winner' && claim.eventScope === 'UNSPECIFIED_EVENT') {
            return `UNGROUPED_${claim.claimId}`;
        }
        const rawKey = `${claim.subject}|${claim.metric}|${claim.operator}|${claim.threshold}|${claim.eventScope}`;
        return crypto.createHash('sha256').update(rawKey).digest('hex');
    }

    /** Deterministic Event ID includes semantic core + eventScope + earliest deadline */
    private generateEventID(claim: MarketClaim, earliestDeadline: string): string {
        const rawKey = `${claim.subject}|${claim.metric}|${claim.operator}|${claim.threshold}|${claim.eventScope}|${earliestDeadline}`;
        return 'EVT_' + crypto.createHash('sha256').update(rawKey).digest('hex').substring(0, 16);
    }

    /** Aggregate an array of MarketClaims into CanonicalEvents */
    aggregate(claims: MarketClaim[]): CanonicalEvent[] {
        const buckets = new Map<string, MarketClaim[]>();
        for (const claim of claims) {
            const key = this.getSemanticGroupingKey(claim);
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key)!.push(claim);
        }

        const results: CanonicalEvent[] = [];
        for (const [_, group] of buckets) {
            if (group.length === 0) continue;
            const representative = group[0];

            // earliest deadline
            const minDeadline = new Date(Math.min(...group.map(g => new Date(g.deadline).getTime()))).toISOString();

            // consensus source – first non‑general if exists
            const consensusSource =
                group.find(g => g.resolutionSource && g.resolutionSource !== 'GENERAL_CONSENSUS')?.resolutionSource ||
                representative.resolutionSource;

            const event: CanonicalEvent = {
                eventID: this.generateEventID(representative, minDeadline),
                subject: representative.subject,
                metric: representative.metric,
                operator: representative.operator,
                threshold: representative.threshold,
                eventScope: representative.eventScope,
                earliestDeadline: minDeadline,
                consensusSource,
                markets: group.map(g => ({
                    source: g.source,
                    marketId: g.marketId,
                    url: g.url,
                    deadline: g.deadline,
                })),
            };
            results.push(event);
        }
        return results;
    }
}
