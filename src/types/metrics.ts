export interface VolumeMetrics {
    totalVolume: number;
    transactionsCount: number;
    averageSpeed: number;
    lastUpdate: Date;
    performance?: {
        profitLoss: number;
        successRate: number;
        averageExecutionTime: number;
    };
    market?: {
        currentSpread: number;
        liquidityDepth: number;
        orderBookImbalance: number;
    };
} 