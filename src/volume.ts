import { VolumeLogger } from './utils/logger';
import { SolanaAPI } from './solanavolume';

export interface VolumeConfig {
    minVolume: number;
    maxVolume: number;
    interval: number;
    wallets: string[];
    buyRatio: number;
    sellRatio: number;
    peakHours: string[];
    rpcEndpoint: string;
    customPatterns?: {
        [key: string]: {
            volume: number;
            ratio: number;
        };
    };
    volumeScaling?: {
        enabled: boolean;
        factor: number;
        interval: number;
    };
    alerts?: {
        volumeThreshold: number;
        errorThreshold: number;
        notifyOnError: boolean;
    };
}

export class VolumeBot {
    private logger: VolumeLogger;
    private api: SolanaAPI;
    private config: VolumeConfig;
    private isRunning: boolean = false;
    private metrics: {
        currentVolume: number;
        buyRatio: number;
        sellRatio: number;
        walletUtilization: number;
        apiResponseTime: number;
        errorRate: number;
    };

    constructor(config: VolumeConfig) {
        this.logger = new VolumeLogger('VolumeBot');
        this.api = new SolanaAPI(process.env.SOLANA_API_KEY || '', config.rpcEndpoint);
        this.config = config;
        this.metrics = {
            currentVolume: 0,
            buyRatio: config.buyRatio,
            sellRatio: config.sellRatio,
            walletUtilization: 0,
            apiResponseTime: 0,
            errorRate: 0
        };
    }

    async start(): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Bot is already running');
            return;
        }

        this.isRunning = true;
        this.logger.info('🚀 Starting Solana Volume Bot...');

        while (this.isRunning) {
            try {
                await this.executeTradingCycle();
                await this.sleep(this.config.interval);
            } catch (error) {
                this.logger.error(`Error in trading cycle: ${error instanceof Error ? error.message : String(error)}`);
                await this.sleep(5000);
            }
        }
    }

    async stop(): Promise<void> {
        this.isRunning = false;
        this.logger.info('🛑 Stopping Solana Volume Bot...');
    }

    async getMetrics() {
        return this.metrics;
    }

    private async executeTradingCycle(): Promise<void> {
        const currentVolume = await this.getCurrentVolume();
        const targetVolume = this.calculateTargetVolume();
        
        this.metrics.currentVolume = currentVolume;
        
        if (currentVolume < targetVolume) {
            await this.executeTrades();
        } else {
            this.logger.info('🎯 Target volume reached, waiting for next cycle');
        }
    }

    private async executeTrades(): Promise<void> {
        const tradeSize = this.calculateTradeSize();
        const isBuy = Math.random() < this.config.buyRatio;

        for (const wallet of this.config.wallets) {
            try {
                const startTime = Date.now();
                if (isBuy) {
                    await this.api.executeBuy(wallet, tradeSize);
                } else {
                    await this.api.executeSell(wallet, tradeSize);
                }
                this.metrics.apiResponseTime = Date.now() - startTime;
                this.logger.info(`💫 Executed ${isBuy ? 'buy' : 'sell'} trade for ${tradeSize} SOL`);
            } catch (error) {
                this.metrics.errorRate++;
                this.logger.error(`Error executing trade for wallet ${wallet}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    private calculateTradeSize(): number {
        const min = this.config.minVolume;
        const max = this.config.maxVolume;
        return min + Math.random() * (max - min);
    }

    private calculateTargetVolume(): number {
        const hour = new Date().getHours();
        const isPeakHour = this.isPeakHour(hour);
        
        if (isPeakHour) {
            return this.config.maxVolume * 1.5;
        }
        
        return this.config.minVolume;
    }

    private isPeakHour(hour: number): boolean {
        return this.config.peakHours.some(range => {
            const [start, end] = range.split('-').map(Number);
            return hour >= start && hour <= end;
        });
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

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
} 