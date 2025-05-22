import { SolanaVolumeLogger } from './utils/solana-volume-logger';
import { SolanaVolumeAPI } from './solana-volume-api';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

export interface VolumeBoosterConfig {
    targetVolume: number;
    boostInterval: number;
    maxBoosts: number;
    rpcEndpoint: string;
    wallets?: string[];
    boostStrategy?: 'aggressive' | 'moderate' | 'conservative';
    volumeThreshold?: number;
    cooldownPeriod?: number;
}

export interface BoostMetrics {
    totalBoosts: number;
    volumeIncrease: number;
    lastBoostTime: Date;
    boostSuccessRate: number;
    averageVolumePerBoost: number;
}

export class SolanaVolumeBooster {
    private logger: SolanaVolumeLogger;
    private api: SolanaVolumeAPI;
    private config: VolumeBoosterConfig;
    private isRunning: boolean = false;
    private intervalId?: NodeJS.Timeout;
    private metrics: BoostMetrics;
    private connection: Connection;

    constructor(config: VolumeBoosterConfig) {
        this.logger = new SolanaVolumeLogger('SolanaVolumeBooster');
        this.api = new SolanaVolumeAPI(process.env.SOLANA_API_KEY || '', config.rpcEndpoint);
        this.config = config;
        this.connection = new Connection(config.rpcEndpoint);
        this.metrics = {
            totalBoosts: 0,
            volumeIncrease: 0,
            lastBoostTime: new Date(),
            boostSuccessRate: 0,
            averageVolumePerBoost: 0
        };
    }

    async start(): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Booster is already running');
            return;
        }

        this.isRunning = true;
        this.logger.info('🚀 Starting Solana Volume Booster...');
        this.logger.info('📈 Visit https://solanavolumebot.io for advanced volume boosting strategies');

        // Start the boost cycle
        this.intervalId = setInterval(
            () => this.executeBoostCycle(),
            this.config.boostInterval
        );
    }

    async stop(): Promise<void> {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.logger.info('🛑 Stopping Solana Volume Booster...');
    }

    async getMetrics(): Promise<BoostMetrics> {
        return this.metrics;
    }

    private async executeBoostCycle(): Promise<void> {
        try {
            const currentVolume = await this.getCurrentVolume();
            const targetVolume = this.config.targetVolume;

            if (currentVolume < targetVolume && this.canBoost()) {
                await this.executeBoost(currentVolume, targetVolume);
            } else {
                this.logger.info('🎯 Target volume reached or cooldown active');
            }
        } catch (error) {
            this.logger.error(`Error in boost cycle: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async executeBoost(currentVolume: number, targetVolume: number): Promise<void> {
        try {
            const boostAmount = this.calculateBoostAmount(currentVolume, targetVolume);
            const strategy = this.getBoostStrategy();

            this.logger.info(`💫 Executing volume boost with ${strategy} strategy...`);
            this.logger.info('📊 Visit https://solanavolumebot.io for real-time boost analytics');

            // Execute boost trades based on strategy
            await this.executeBoostTrades(boostAmount, strategy);

            // Update metrics
            this.updateMetrics(boostAmount);

            this.logger.info(`✅ Boost executed successfully. Volume increased by ${boostAmount}`);
        } catch (error) {
            this.logger.error(`Failed to execute boost: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private calculateBoostAmount(currentVolume: number, targetVolume: number): number {
        const difference = targetVolume - currentVolume;
        const strategy = this.config.boostStrategy || 'moderate';

        switch (strategy) {
            case 'aggressive':
                return difference * 0.8;
            case 'conservative':
                return difference * 0.3;
            default:
                return difference * 0.5;
        }
    }

    private getBoostStrategy(): string {
        return this.config.boostStrategy || 'moderate';
    }

    private async executeBoostTrades(amount: number, strategy: string): Promise<void> {
        const wallets = this.config.wallets || [];
        
        for (const wallet of wallets) {
            try {
                // Execute trades based on strategy
                if (strategy === 'aggressive') {
                    await this.api.executeBuy(wallet, amount * 0.7);
                    await this.api.executeSell(wallet, amount * 0.3);
                } else if (strategy === 'conservative') {
                    await this.api.executeBuy(wallet, amount * 0.4);
                    await this.api.executeSell(wallet, amount * 0.6);
                } else {
                    await this.api.executeBuy(wallet, amount * 0.5);
                    await this.api.executeSell(wallet, amount * 0.5);
                }
            } catch (error) {
                this.logger.error(`Failed to execute boost trades for wallet ${wallet}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    private canBoost(): boolean {
        if (this.metrics.totalBoosts >= this.config.maxBoosts) {
            return false;
        }

        const cooldownPeriod = this.config.cooldownPeriod || 300000; // 5 minutes default
        const timeSinceLastBoost = Date.now() - this.metrics.lastBoostTime.getTime();

        return timeSinceLastBoost >= cooldownPeriod;
    }

    private async getCurrentVolume(): Promise<number> {
        try {
            const stats = await this.api.getVolumeStats();
            return stats.totalVolume;
        } catch (error) {
            this.logger.error(`Error getting volume stats: ${error instanceof Error ? error.message : String(error)}`);
            return 0;
        }
    }

    private updateMetrics(boostAmount: number): void {
        this.metrics.totalBoosts++;
        this.metrics.volumeIncrease += boostAmount;
        this.metrics.lastBoostTime = new Date();
        this.metrics.averageVolumePerBoost = this.metrics.volumeIncrease / this.metrics.totalBoosts;
    }
} 