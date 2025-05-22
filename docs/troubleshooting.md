# Troubleshooting Guide

This guide helps you resolve common issues with the Pump Fun Volume Bot.

## Installation Issues

### Node.js Version Mismatch

**Symptoms:**
- Installation fails
- Version errors
- Compatibility warnings

**Solution:**
1. Check Node.js version:
```bash
node --version
```

2. Install correct version:
```bash
nvm install 16
nvm use 16
```

3. Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

### Missing Dependencies

**Symptoms:**
- Module not found errors
- Missing package warnings
- Build failures

**Solution:**
1. Install dependencies:
```bash
npm install
```

2. Check for outdated packages:
```bash
npm outdated
```

3. Update packages:
```bash
npm update
```

## Runtime Issues

### Bot Not Starting

**Symptoms:**
- Bot fails to start
- No error messages
- Process exits immediately

**Solution:**
1. Check logs:
```bash
tail -f logs/bot.log
```

2. Verify configuration:
```bash
cat .env
```

3. Test API connection:
```bash
curl https://api.pump.fun/health
```

### Connection Issues

**Symptoms:**
- API connection errors
- Timeout errors
- Network errors

**Solution:**
1. Check API key:
```bash
echo $PUMPFUN_API_KEY
```

2. Verify network:
```bash
ping api.pump.fun
```

3. Check rate limits:
```bash
curl -I https://api.pump.fun/rate-limit
```

### Performance Issues

**Symptoms:**
- High CPU usage
- Memory leaks
- Slow response times

**Solution:**
1. Monitor resources:
```bash
top -p $(pgrep -f "node.*bot")
```

2. Check Node.js settings:
```bash
node --max-old-space-size=4096 bot.js
```

3. Optimize configuration:
```typescript
const bot = new VolumeBot({
    interval: 600000, // Increase interval
    maxConcurrent: 5  // Limit concurrent operations
});
```

## Trading Issues

### Volume Not Increasing

**Symptoms:**
- Low trading volume
- Volume below target
- No trades executed

**Solution:**
1. Check volume configuration:
```typescript
console.log(bot.getMetrics());
```

2. Verify wallet balances:
```typescript
console.log(await bot.getWalletBalances());
```

3. Adjust trading parameters:
```typescript
await bot.updateConfig({
    minVolume: 2000,
    maxVolume: 15000
});
```

### Trade Failures

**Symptoms:**
- Failed transactions
- Error messages
- Rejected trades

**Solution:**
1. Check error logs:
```bash
grep "ERROR" logs/bot.log
```

2. Verify gas settings:
```typescript
await bot.setGasPrice(50); // Gwei
```

3. Implement retry mechanism:
```typescript
const bot = new VolumeBot({
    maxRetries: 3,
    retryDelay: 5000
});
```

## Security Issues

### API Key Issues

**Symptoms:**
- Authentication errors
- Invalid key messages
- Access denied

**Solution:**
1. Verify API key:
```bash
curl -H "Authorization: Bearer $PUMPFUN_API_KEY" https://api.pump.fun/verify
```

2. Generate new key:
```bash
curl -X POST https://api.pump.fun/keys/generate
```

3. Update environment:
```bash
echo "PUMPFUN_API_KEY=new_key_here" > .env
```

### Wallet Security

**Symptoms:**
- Unauthorized transactions
- Balance changes
- Suspicious activity

**Solution:**
1. Monitor wallets:
```typescript
await bot.monitorWallets();
```

2. Set transaction limits:
```typescript
await bot.setTransactionLimits({
    maxAmount: 1000,
    dailyLimit: 10000
});
```

3. Enable notifications:
```typescript
bot.on('suspicious', (event) => {
    notifyAdmin(event);
});
```

## Monitoring Issues

### Logging Problems

**Symptoms:**
- Missing logs
- Incomplete logs
- Log rotation issues

**Solution:**
1. Configure logging:
```typescript
const logger = new Logger({
    level: 'debug',
    file: 'logs/bot.log',
    maxSize: '10m',
    maxFiles: 5
});
```

2. Implement log rotation:
```typescript
const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/bot-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '10m',
    maxFiles: '14d'
});
```

3. Check log directory:
```bash
ls -la logs/
```

### Alert Issues

**Symptoms:**
- Missing alerts
- Delayed notifications
- Alert spam

**Solution:**
1. Configure alerts:
```typescript
const bot = new VolumeBot({
    alerts: {
        volumeThreshold: 0.8,
        errorThreshold: 5,
        notifyOnError: true
    }
});
```

2. Implement alert throttling:
```typescript
const throttledAlert = throttle(alert, 60000); // 1 minute
```

3. Test alert system:
```typescript
await bot.testAlerts();
```

## Maintenance

### Regular Checks

1. Daily checks:
```bash
npm run check:daily
```

2. Weekly checks:
```bash
npm run check:weekly
```

3. Monthly checks:
```bash
npm run check:monthly
```

### Backup Procedures

1. Backup configuration:
```bash
cp .env .env.backup
cp wallets.json wallets.json.backup
```

2. Backup logs:
```bash
tar -czf logs-backup.tar.gz logs/
```

3. Backup database:
```bash
mongodump --db pumpfun --out ./backup
```

## Support

For technical support:
- Join our Discord community
- Check the documentation
- Open an issue on GitHub

## Updates

This guide will be regularly updated with:
- New solutions
- Best practices
- Common issues
- Security recommendations 