import { VolumeStrategy } from '../types/strategy';
import { VolumeMetrics } from '../types/metrics';

export class VolumeBoosterStrategy implements VolumeStrategy {
    name = 'Volume Booster Strategy';
    description = 'Aggressive volume boosting with safety controls';

    private boostFactor: number;
    private maxBoost: number;
    private cooldown: number;
    private lastBoostTime: Date;

    constructor(
        boostFactor: number = 2.0,
        maxBoost: number = 10000,
        cooldown: number = 3600000 // 1 hour in milliseconds
    ) {
        this.boostFactor = boostFactor;
        this.maxBoost = maxBoost;
        this.cooldown = cooldown;
        this.lastBoostTime = new Date(0);
    }

    calculateVolume(metrics: VolumeMetrics): number {
        if (!this.validateMetrics(metrics)) {
            return 0;
        }

        const now = new Date();
        const timeSinceLastBoost = now.getTime() - this.lastBoostTime.getTime();

        // Check cooldown period
        if (timeSinceLastBoost < this.cooldown) {
            return 0;
        }

        // Calculate base volume
        let volume = metrics.totalVolume * this.boostFactor;

        // Apply safety limits
        volume = Math.min(volume, this.maxBoost);

        // Check performance metrics
        if (metrics.performance?.successRate && metrics.performance.successRate < 0.8) {
            volume *= 0.5; // Reduce volume if success rate is low
        }

        // Update last boost time if we're going to execute
        if (volume > 0) {
            this.lastBoostTime = now;
        }

        return volume;
    }

    validateMetrics(metrics: VolumeMetrics): boolean {
        return (
            metrics.totalVolume > 0 &&
            metrics.performance?.successRate !== undefined &&
            metrics.performance?.profitLoss !== undefined
        );
    }

    getStrategyParams(): Record<string, any> {
        return {
            boostFactor: this.boostFactor,
            maxBoost: this.maxBoost,
            cooldown: this.cooldown,
            lastBoostTime: this.lastBoostTime
        };
    }
} 