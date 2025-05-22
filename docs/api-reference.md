# API Reference

This document provides detailed information about the Pump Fun Volume Bot API.

## VolumeBot Class

The main class for managing trading volume on Pump.Fun.

### Constructor

```typescript
new VolumeBot(config: VolumeConfig)
```

#### Configuration Interface

```typescript
interface VolumeConfig {
    minVolume: number;        // Minimum volume to maintain
    maxVolume: number;        // Maximum volume to maintain
    interval: number;         // Trading interval in milliseconds
    wallets: string[];        // Array of wallet addresses
    buyRatio: number;         // Buy trade ratio (0-1)
    sellRatio: number;        // Sell trade ratio (0-1)
    peakHours?: string[];     // Optional peak hours
    customPatterns?: {        // Optional custom patterns
        [key: string]: {
            volume: number;
            ratio: number;
        }
    };
    volumeScaling?: {         // Optional volume scaling
        enabled: boolean;
        factor: number;
        interval: number;
    };
    alerts?: {                // Optional alert settings
        volumeThreshold: number;
        errorThreshold: number;
        notifyOnError: boolean;
    };
}
```

### Methods

#### start()

Starts the volume bot.

```typescript
async start(): Promise<void>
```

Example:
```typescript
await bot.start();
```

#### stop()

Stops the volume bot.

```typescript
async stop(): Promise<void>
```

Example:
```typescript
await bot.stop();
```

#### getMetrics()

Gets current performance metrics.

```typescript
async getMetrics(): Promise<Metrics>
```

Returns:
```typescript
interface Metrics {
    currentVolume: number;
    buyRatio: number;
    sellRatio: number;
    walletUtilization: number;
    apiResponseTime: number;
    errorRate: number;
}
```

Example:
```typescript
const metrics = await bot.getMetrics();
console.log(metrics);
```

#### setVolume(target: number)

Sets a new target volume.

```typescript
async setVolume(target: number): Promise<void>
```

Example:
```typescript
await bot.setVolume(5000);
```

#### updateConfig(config: Partial<VolumeConfig>)

Updates bot configuration.

```typescript
async updateConfig(config: Partial<VolumeConfig>): Promise<void>
```

Example:
```typescript
await bot.updateConfig({
    minVolume: 2000,
    maxVolume: 15000
});
```

## PumpFunAPI Class

Handles API interactions with Pump.Fun.

### Constructor

```typescript
new PumpFunAPI(apiKey: string)
```

### Methods

#### executeBuy(wallet: string, amount: number)

Executes a buy trade.

```typescript
async executeBuy(wallet: string, amount: number): Promise<TradeResult>
```

Returns:
```typescript
interface TradeResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}
```

Example:
```typescript
const result = await api.executeBuy('wallet1', 1000);
```

#### executeSell(wallet: string, amount: number)

Executes a sell trade.

```typescript
async executeSell(wallet: string, amount: number): Promise<TradeResult>
```

Example:
```typescript
const result = await api.executeSell('wallet1', 1000);
```

#### getVolumeStats()

Gets current volume statistics.

```typescript
async getVolumeStats(): Promise<VolumeStats>
```

Returns:
```typescript
interface VolumeStats {
    totalVolume: number;
    buyVolume: number;
    sellVolume: number;
    lastUpdate: Date;
}
```

Example:
```typescript
const stats = await api.getVolumeStats();
console.log(stats);
```

## Logger Class

Handles logging functionality.

### Constructor

```typescript
new Logger(context: string)
```

### Methods

#### info(message: string)

Logs an info message.

```typescript
info(message: string): void
```

Example:
```typescript
logger.info('Bot started');
```

#### error(message: string, error?: Error)

Logs an error message.

```typescript
error(message: string, error?: Error): void
```

Example:
```typescript
logger.error('Trade failed', error);
```

#### warn(message: string)

Logs a warning message.

```typescript
warn(message: string): void
```

Example:
```typescript
logger.warn('Low wallet balance');
```

#### debug(message: string)

Logs a debug message.

```typescript
debug(message: string): void
```

Example:
```typescript
logger.debug('Trade executed');
```

## Error Handling

The bot uses custom error classes for different types of errors:

```typescript
class VolumeBotError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'VolumeBotError';
    }
}

class APIError extends VolumeBotError {
    constructor(message: string) {
        super(message);
        this.name = 'APIError';
    }
}

class ConfigurationError extends VolumeBotError {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigurationError';
    }
}
```

Example error handling:
```typescript
try {
    await bot.start();
} catch (error) {
    if (error instanceof APIError) {
        console.error('API error:', error.message);
    } else if (error instanceof ConfigurationError) {
        console.error('Configuration error:', error.message);
    } else {
        console.error('Unknown error:', error);
    }
}
```

## Events

The bot emits events for important state changes:

```typescript
interface BotEvents {
    'start': () => void;
    'stop': () => void;
    'trade': (result: TradeResult) => void;
    'error': (error: Error) => void;
    'metrics': (metrics: Metrics) => void;
}
```

Example event handling:
```typescript
bot.on('trade', (result) => {
    console.log('Trade executed:', result);
});

bot.on('error', (error) => {
    console.error('Bot error:', error);
});
``` 