# Configuration Guide

This guide explains all configuration options available for the Pump Fun Volume Bot.

## Environment Variables

### API Configuration
```env
# Your Pump.Fun API key
PUMPFUN_API_KEY=your_api_key_here
```

### Bot Configuration
```env
# Minimum volume to maintain (in USD)
MIN_VOLUME=1000

# Maximum volume to maintain (in USD)
MAX_VOLUME=10000

# Trading interval in milliseconds (default: 5 minutes)
TRADING_INTERVAL=300000

# Buy/Sell ratio (default: 60% buy, 40% sell)
BUY_RATIO=0.6
SELL_RATIO=0.4
```

### Wallet Configuration
```env
# Comma-separated list of wallet addresses
WALLET_ADDRESSES=wallet1,wallet2,wallet3
```

### Peak Hours
```env
# Peak hours in 24-hour format (comma-separated)
PEAK_HOURS=9-12,14-17,19-22
```

### Debug Mode
```env
# Enable debug logging
DEBUG=false
```

## Volume Configuration

### Minimum Volume
- Purpose: Sets the minimum trading volume to maintain
- Recommended: Start with 1000 USD
- Impact: Lower values may not provide sufficient activity

### Maximum Volume
- Purpose: Sets the maximum trading volume to maintain
- Recommended: 5-10x minimum volume
- Impact: Higher values require more wallet balance

### Trading Interval
- Purpose: Controls how often trades are executed
- Recommended: 300000 (5 minutes)
- Impact: Lower intervals increase API usage

## Trading Strategy

### Buy/Sell Ratio
- Purpose: Controls the distribution of buy and sell trades
- Recommended: 0.6/0.4 (60% buy, 40% sell)
- Impact: Affects price stability and volume distribution

### Peak Hours
- Purpose: Defines optimal trading hours
- Format: HH-HH (24-hour format)
- Example: 9-12,14-17,19-22
- Impact: Concentrates trading during high-activity periods

## Wallet Management

### Multiple Wallets
- Purpose: Distributes trading across multiple wallets
- Recommended: 3-5 wallets
- Impact: Reduces detection risk and improves distribution

### Wallet Balance
- Minimum: 1.5x maximum volume per wallet
- Recommended: 2x maximum volume per wallet
- Impact: Ensures sufficient funds for trading

## Best Practices

1. Start with conservative settings
2. Monitor performance for 24-48 hours
3. Gradually adjust based on results
4. Keep wallet balances well-funded
5. Use multiple wallets for distribution
6. Monitor API usage and rate limits
7. Enable debug mode for troubleshooting

## Advanced Configuration

### Custom Trading Patterns
```typescript
const bot = new VolumeBot({
    // ... basic config ...
    customPatterns: {
        morning: { volume: 2000, ratio: 0.7 },
        afternoon: { volume: 3000, ratio: 0.5 },
        evening: { volume: 4000, ratio: 0.6 }
    }
});
```

### Volume Scaling
```typescript
const bot = new VolumeBot({
    // ... basic config ...
    volumeScaling: {
        enabled: true,
        factor: 1.2,
        interval: 3600000
    }
});
```

## Monitoring and Alerts

### Performance Metrics
- Volume achieved
- Buy/Sell ratio
- Wallet utilization
- API response times
- Error rates

### Alert Configuration
```typescript
const bot = new VolumeBot({
    // ... basic config ...
    alerts: {
        volumeThreshold: 0.8,
        errorThreshold: 5,
        notifyOnError: true
    }
});
```

## Security Considerations

1. Keep API keys secure
2. Use environment variables
3. Monitor for suspicious activity
4. Regular security updates
5. Backup configurations
6. Monitor wallet balances
7. Use secure connections 