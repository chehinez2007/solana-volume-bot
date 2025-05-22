# Getting Started with Pump Fun Volume Bot

This guide will help you set up and start using the Pump Fun Volume Bot.

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- TypeScript 4.x or higher
- Pump.Fun API Key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/A12RGA1645773/pump-fun-volume-bot.git
cd pump-fun-volume-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# API Configuration
PUMPFUN_API_KEY=your_api_key_here

# Bot Configuration
MIN_VOLUME=1000
MAX_VOLUME=10000
TRADING_INTERVAL=300000
BUY_RATIO=0.6
SELL_RATIO=0.4

# Wallet Configuration
WALLET_ADDRESSES=wallet1,wallet2,wallet3

# Peak Hours (24-hour format)
PEAK_HOURS=9-12,14-17,19-22
```

## Quick Start

1. Build the project:
```bash
npm run build
```

2. Start the bot:
```bash
npm start
```

## Basic Usage

```typescript
import { VolumeBot } from './src/volume';

const bot = new VolumeBot({
    minVolume: 1000,
    maxVolume: 10000,
    interval: 300000,
    wallets: ['wallet1', 'wallet2', 'wallet3'],
    buyRatio: 0.6,
    sellRatio: 0.4,
    peakHours: ['9-12', '14-17', '19-22']
});

// Start the bot
await bot.start();

// Stop the bot
await bot.stop();
```

## Next Steps

- Read the [Configuration Guide](./configuration.md) for detailed settings
- Check the [API Reference](./api-reference.md) for available methods
- Review [Best Practices](./best-practices.md) for optimal usage
- Join our [Discord Community](https://discord.gg/pumpfun) for support 