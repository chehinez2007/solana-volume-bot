import { VolumeStrategy } from '../types/strategy';
import { VolumeMetrics } from '../types/metrics';

export class MarketMakerStrategy implements VolumeStrategy {
    name = 'Market Maker Strategy';
    description = 'Professional market making with dynamic spread and depth control';

    private spread: number;
    private depth: number;
    private imbalanceThreshold: number;

    constructor(spread: number = 0.001, depth: number = 1000, imbalanceThreshold: number = 0.2) {
        this.spread = spread;
        this.depth = depth;
        this.imbalanceThreshold = imbalanceThreshold;
    }

    calculateVolume(metrics: VolumeMetrics): number {
        if (!this.validateMetrics(metrics)) {
            return 0;
        }

        const imbalance = metrics.market?.orderBookImbalance || 0;
        const currentSpread = metrics.market?.currentSpread || this.spread;
        const liquidityDepth = metrics.market?.liquidityDepth || this.depth;

        // Adjust volume based on market conditions
        let volume = this.depth;
        
        // Reduce volume if spread is too tight
        if (currentSpread < this.spread * 0.5) {
            volume *= 0.5;
        }

        // Increase volume if there's significant imbalance
        if (Math.abs(imbalance) > this.imbalanceThreshold) {
            volume *= (1 + Math.abs(imbalance));
        }

        // Adjust based on available liquidity
        volume = Math.min(volume, liquidityDepth * 0.1);

        return volume;
    }

    validateMetrics(metrics: VolumeMetrics): boolean {
        return (
            metrics.market?.currentSpread !== undefined &&
            metrics.market?.liquidityDepth !== undefined &&
            metrics.market?.orderBookImbalance !== undefined
        );
    }

    getStrategyParams(): Record<string, any> {
        return {
            spread: this.spread,
            depth: this.depth,
            imbalanceThreshold: this.imbalanceThreshold
        };
    }
} 