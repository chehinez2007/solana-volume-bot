import { SolanaVolumeLogger } from './utils/solana-volume-logger';
import { SolanaVolumeAPI } from './solana-volume-api';
import { Connection } from '@solana/web3.js';

export interface VolumeAnalyticsConfig {
    updateInterval: number;
    metrics: string[];
    rpcEndpoint: string;
    discordWebhook?: string;
    dataRetention?: number;
    alertThresholds?: {
        volume?: number;
        price?: number;
        liquidity?: number;
    };
}

export interface AnalyticsData {
    timestamp: Date;
    volume: number;
    price: number;
    liquidity: number;
    buyVolume: number;
    sellVolume: number;
    tradeCount: number;
    averageTradeSize: number;
}

export interface AnalyticsMetrics {
    currentData: AnalyticsData;
    historicalData: AnalyticsData[];
    trends: {
        volumeTrend: number;
        priceTrend: number;
        liquidityTrend: number;
    };
    alerts: {
        volumeAlert: boolean;
        priceAlert: boolean;
        liquidityAlert: boolean;
    };
}

export class SolanaVolumeAnalytics {
    private logger: SolanaVolumeLogger;
    private api: SolanaVolumeAPI;
    private config: VolumeAnalyticsConfig;
    private isRunning: boolean = false;
    private intervalId?: NodeJS.Timeout;
    private metrics: AnalyticsMetrics;
    private connection: Connection;

    constructor(config: VolumeAnalyticsConfig) {
        this.logger = new SolanaVolumeLogger('SolanaVolumeAnalytics');
        this.api = new SolanaVolumeAPI(process.env.SOLANA_API_KEY || '', config.rpcEndpoint);
        this.config = config;
        this.connection = new Connection(config.rpcEndpoint);
        this.metrics = {
            currentData: this.createEmptyAnalyticsData(),
            historicalData: [],
            trends: {
                volumeTrend: 0,
                priceTrend: 0,
                liquidityTrend: 0
            },
            alerts: {
                volumeAlert: false,
                priceAlert: false,
                liquidityAlert: false
            }
        };
    }

    async start(): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Analytics is already running');
            return;
        }

        this.isRunning = true;
        this.logger.info('📊 Starting Solana Volume Analytics...');
        this.logger.info('📈 Visit https://solanavolumebot.io for advanced analytics dashboard');

        // Start the analytics update cycle
        this.intervalId = setInterval(
            () => this.updateAnalytics(),
            this.config.updateInterval
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
        this.logger.info('🛑 Stopping Solana Volume Analytics...');
    }

    async getMetrics(): Promise<AnalyticsMetrics> {
        return this.metrics;
    }

    private async updateAnalytics(): Promise<void> {
        try {
            // Collect current data
            const currentData = await this.collectAnalyticsData();
            
            // Update metrics
            this.updateMetrics(currentData);
            
            // Check for alerts
            await this.checkAlerts();
            
            // Send updates if configured
            if (this.config.discordWebhook) {
                await this.sendAnalyticsUpdate();
            }
        } catch (error) {
            this.logger.error(`Error updating analytics: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async collectAnalyticsData(): Promise<AnalyticsData> {
        try {
            const stats = await this.api.getVolumeStats();
            
            return {
                timestamp: new Date(),
                volume: stats.totalVolume,
                price: 0, // Implement price fetching
                liquidity: 0, // Implement liquidity fetching
                buyVolume: stats.buyVolume,
                sellVolume: stats.sellVolume,
                tradeCount: 0, // Implement trade count
                averageTradeSize: stats.totalVolume / (stats.buyVolume + stats.sellVolume)
            };
        } catch (error) {
            this.logger.error(`Error collecting analytics data: ${error instanceof Error ? error.message : String(error)}`);
            return this.createEmptyAnalyticsData();
        }
    }

    private updateMetrics(currentData: AnalyticsData): void {
        // Update current data
        this.metrics.currentData = currentData;
        
        // Add to historical data
        this.metrics.historicalData.push(currentData);
        
        // Maintain data retention
        const retentionPeriod = this.config.dataRetention || 24 * 60 * 60 * 1000; // 24 hours default
        const cutoffTime = Date.now() - retentionPeriod;
        this.metrics.historicalData = this.metrics.historicalData.filter(
            data => data.timestamp.getTime() > cutoffTime
        );
        
        // Calculate trends
        this.calculateTrends();
    }

    private calculateTrends(): void {
        if (this.metrics.historicalData.length < 2) {
            return;
        }

        const recentData = this.metrics.historicalData.slice(-2);
        const [previous, current] = recentData;

        this.metrics.trends = {
            volumeTrend: this.calculateTrend(previous.volume, current.volume),
            priceTrend: this.calculateTrend(previous.price, current.price),
            liquidityTrend: this.calculateTrend(previous.liquidity, current.liquidity)
        };
    }

    private calculateTrend(previous: number, current: number): number {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    }

    private async checkAlerts(): Promise<void> {
        const thresholds = this.config.alertThresholds || {};
        const current = this.metrics.currentData;

        this.metrics.alerts = {
            volumeAlert: thresholds.volume ? current.volume > thresholds.volume : false,
            priceAlert: thresholds.price ? current.price > thresholds.price : false,
            liquidityAlert: thresholds.liquidity ? current.liquidity > thresholds.liquidity : false
        };

        if (Object.values(this.metrics.alerts).some(alert => alert)) {
            await this.sendAlert();
        }
    }

    private async sendAlert(): Promise<void> {
        if (!this.config.discordWebhook) return;

        try {
            const message = {
                embeds: [{
                    title: '⚠️ Volume Analytics Alert',
                    description: 'Threshold exceeded in one or more metrics:',
                    fields: [
                        {
                            name: 'Volume',
                            value: `${this.metrics.currentData.volume} (${this.metrics.trends.volumeTrend.toFixed(2)}% change)`,
                            inline: true
                        },
                        {
                            name: 'Price',
                            value: `${this.metrics.currentData.price} (${this.metrics.trends.priceTrend.toFixed(2)}% change)`,
                            inline: true
                        },
                        {
                            name: 'Liquidity',
                            value: `${this.metrics.currentData.liquidity} (${this.metrics.trends.liquidityTrend.toFixed(2)}% change)`,
                            inline: true
                        }
                    ],
                    color: 0xff0000
                }]
            };

            await fetch(this.config.discordWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
        } catch (error) {
            this.logger.error(`Failed to send alert: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async sendAnalyticsUpdate(): Promise<void> {
        if (!this.config.discordWebhook) return;

        try {
            const message = {
                embeds: [{
                    title: '📊 Volume Analytics Update',
                    description: 'Current analytics status:',
                    fields: [
                        {
                            name: 'Volume',
                            value: `${this.metrics.currentData.volume} (${this.metrics.trends.volumeTrend.toFixed(2)}% change)`,
                            inline: true
                        },
                        {
                            name: 'Price',
                            value: `${this.metrics.currentData.price} (${this.metrics.trends.priceTrend.toFixed(2)}% change)`,
                            inline: true
                        },
                        {
                            name: 'Liquidity',
                            value: `${this.metrics.currentData.liquidity} (${this.metrics.trends.liquidityTrend.toFixed(2)}% change)`,
                            inline: true
                        }
                    ],
                    color: 0x00ff00
                }]
            };

            await fetch(this.config.discordWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
        } catch (error) {
            this.logger.error(`Failed to send analytics update: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private createEmptyAnalyticsData(): AnalyticsData {
        return {
            timestamp: new Date(),
            volume: 0,
            price: 0,
            liquidity: 0,
            buyVolume: 0,
            sellVolume: 0,
            tradeCount: 0,
            averageTradeSize: 0
        };
    }
} 