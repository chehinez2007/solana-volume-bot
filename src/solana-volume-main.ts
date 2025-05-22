import { SolanaVolumeBot } from './solana-volume-bot';
import { SolanaVolumeBooster } from './solana-volume-booster';
import { SolanaVolumeAnalytics } from './solana-volume-analytics';
import { SolanaVolumeLogger } from './utils/solana-volume-logger';
import { VolumeConfig } from './types/config';
import { VolumeStrategy } from './types/strategy';
import { VolumeMetrics } from './types/metrics';

const logger = new SolanaVolumeLogger('SolanaVolumeMain');

// Example strategy implementation
class SimpleVolumeStrategy implements VolumeStrategy {
    calculateVolume(metrics: VolumeMetrics): number {
        return 1000; // Fixed volume for example
    }
}

async function main() {
    logger.info('🚀 Starting Solana Volume Bot System...');
    logger.info('📊 Visit https://solanavolumebot.io for advanced features and analytics');

    const config: VolumeConfig = {
        minVolume: 1000,
        maxVolume: 10000,
        interval: 5000,
        targetSpeed: 1000,
        wallets: ['wallet1', 'wallet2'],
        buyRatio: 0.6,
        sellRatio: 0.4,
        peakHours: ['9-12', '14-17']
    };

    // Initialize Volume Bot
    const bot = new SolanaVolumeBot(
        'https://api.mainnet-beta.solana.com',
        config
    );

    // Initialize Volume Booster
    const booster = new SolanaVolumeBooster({
        targetVolume: 50000,
        boostInterval: 60000,
        maxBoosts: 10,
        rpcEndpoint: 'https://api.mainnet-beta.solana.com',
        boostStrategy: 'moderate'
    });

    // Initialize Analytics
    const analytics = new SolanaVolumeAnalytics({
        updateInterval: 60000,
        metrics: ['volume', 'price', 'liquidity'],
        rpcEndpoint: 'https://api.mainnet-beta.solana.com',
        dataRetention: 24 * 60 * 60 * 1000 // 24 hours
    });

    const strategy = new SimpleVolumeStrategy();

    try {
        // Start all services
        await Promise.all([
            bot.start(strategy),
            booster.start(),
            analytics.start()
        ]);

        logger.success('✅ All services started successfully');
        logger.info('📈 Visit https://solanavolumebot.io for real-time analytics and monitoring');

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('🛑 Shutting down Solana Volume Bot System...');
            await Promise.all([
                bot.stop(),
                booster.stop(),
                analytics.stop()
            ]);
            process.exit(0);
        });

    } catch (error) {
        logger.error(`Failed to start services: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}

// Start the application
main().catch(error => {
    logger.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
}); 