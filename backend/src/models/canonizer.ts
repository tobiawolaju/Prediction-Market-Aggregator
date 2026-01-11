import crypto from 'crypto';
import { Rules } from './rules';
import { MarketClaim } from './types';

export class Canonizer {
    /**
     * Normalize raw market items from a given source into MarketClaim objects.
     * @param rawItems Array of raw market objects from the source API.
     * @param source Identifier of the source.
     */
    normalize(rawItems: any[], source: 'polymarket' | 'manifold' | 'kalshi' | 'robinhood'): MarketClaim[] {
        const claims: MarketClaim[] = [];
        for (const item of rawItems) {
            const claim = this.processItem(item, source);
            if (claim) claims.push(claim);
        }
        return claims;
    }

    private generateClaimId(source: string, marketId: string): string {
        return crypto.createHash('sha256').update(`${source}|${marketId}`).digest('hex');
    }

    private processItem(item: any, source: string): MarketClaim | null {
        // Extract common fields depending on source structure
        let question = '';
        let deadline = '';
        let url = '';
        let marketId = '';

        if (source === 'polymarket') {
            question = item.rawPayload?.question ?? '';
            deadline = item.rawPayload?.endDate ?? '';
            marketId = item.marketId ?? '';
            const slug = item.rawPayload?.slug;
            url = slug ? `https://polymarket.com/event/${slug}` : `https://polymarket.com/market/${marketId}`;
        } else if (source === 'manifold') {
            question = item.rawPayload?.question ?? '';
            deadline = item.rawPayload?.closeTime ? new Date(item.rawPayload.closeTime).toISOString() : '';
            marketId = item.marketId ?? '';
            url = item.rawPayload?.url ?? '';
        }

        // Apply rule engine – first matching rule wins
        for (const key in Rules) {
            const rule = (Rules as any)[key];
            if (rule.detect(question, item)) {
                const partial = rule.extract(question, item);
                if (partial) {
                    return {
                        claimId: this.generateClaimId(source, marketId),
                        subject: partial.subject!,
                        metric: partial.metric!,
                        operator: partial.operator!,
                        threshold: partial.threshold!,
                        eventScope: partial.eventScope || 'UNSPECIFIED_EVENT',
                        deadline,
                        resolutionSource: partial.resolutionSource || 'GENERAL_CONSENSUS',
                        source: source as any,
                        marketId,
                        originalQuestion: question,
                        url,
                    } as MarketClaim;
                }
            }
        }
        // No rule matched – skip this market
        return null;
    }
}
