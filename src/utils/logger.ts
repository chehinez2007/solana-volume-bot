export class VolumeLogger {
    private context: string;

    constructor(context: string = 'SolanaVolumeBot') {
        this.context = context;
    }

    info(message: string, ...args: any[]): void {
        console.log(`[${this.context}] INFO: ${message}`, ...args);
    }

    error(message: string, ...args: any[]): void {
        console.error(`[${this.context}] ERROR: ${message}`, ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`[${this.context}] WARN: ${message}`, ...args);
    }

    debug(message: string, ...args: any[]): void {
        console.debug(`[${this.context}] DEBUG: ${message}`, ...args);
    }

    metrics(metrics: Record<string, any>): void {
        console.log(`[${this.context}] METRICS:`, metrics);
    }
} 