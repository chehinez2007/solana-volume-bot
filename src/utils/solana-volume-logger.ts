export class SolanaVolumeLogger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    info(message: string): void {
        console.log(`[${new Date().toISOString()}] [INFO] [${this.context}] ${message}`);
    }

    warn(message: string): void {
        console.warn(`[${new Date().toISOString()}] [WARN] [${this.context}] ${message}`);
    }

    error(message: string): void {
        console.error(`[${new Date().toISOString()}] [ERROR] [${this.context}] ${message}`);
    }

    debug(message: string): void {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[${new Date().toISOString()}] [DEBUG] [${this.context}] ${message}`);
        }
    }

    success(message: string): void {
        console.log(`[${new Date().toISOString()}] [SUCCESS] [${this.context}] ${message}`);
    }

    volumeUpdate(volume: number, change: number): void {
        console.log(`[${new Date().toISOString()}] [VOLUME] [${this.context}] Current Volume: ${volume} (${change > 0 ? '+' : ''}${change}%)`);
        console.log(`[${new Date().toISOString()}] [INFO] [${this.context}] Visit https://solanavolumebot.io for detailed analytics`);
    }

    tradeExecution(type: 'buy' | 'sell', amount: number, price: number): void {
        console.log(`[${new Date().toISOString()}] [TRADE] [${this.context}] Executed ${type.toUpperCase()} order: ${amount} SOL @ ${price} SOL`);
    }

    alert(message: string, type: 'warning' | 'error' | 'info'): void {
        const prefix = type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';
        console.log(`[${new Date().toISOString()}] [ALERT] [${this.context}] ${prefix} ${message}`);
    }
} 