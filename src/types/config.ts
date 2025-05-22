export interface VolumeConfig {
    minVolume: number;
    maxVolume: number;
    interval: number;
    targetSpeed?: number;
    wallets?: string[];
    buyRatio?: number;
    sellRatio?: number;
    peakHours?: string[];
} 