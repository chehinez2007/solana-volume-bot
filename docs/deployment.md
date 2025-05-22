# Deployment Guide

This guide explains how to deploy the Pump Fun Volume Bot in various environments.

## Local Deployment

### Prerequisites

1. Node.js 16.x or higher
2. npm 7.x or higher
3. TypeScript 4.x or higher
4. Pump.Fun API Key

### Steps

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

4. Configure environment variables:
```env
PUMPFUN_API_KEY=your_api_key_here
MIN_VOLUME=1000
MAX_VOLUME=10000
TRADING_INTERVAL=300000
BUY_RATIO=0.6
SELL_RATIO=0.4
WALLET_ADDRESSES=wallet1,wallet2,wallet3
PEAK_HOURS=9-12,14-17,19-22
```

5. Build the project:
```bash
npm run build
```

6. Start the bot:
```bash
npm start
```

## Docker Deployment

### Prerequisites

1. Docker
2. Docker Compose

### Steps

1. Create a Dockerfile:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

2. Create docker-compose.yml:
```yaml
version: '3'
services:
  bot:
    build: .
    environment:
      - PUMPFUN_API_KEY=${PUMPFUN_API_KEY}
      - MIN_VOLUME=${MIN_VOLUME}
      - MAX_VOLUME=${MAX_VOLUME}
      - TRADING_INTERVAL=${TRADING_INTERVAL}
      - BUY_RATIO=${BUY_RATIO}
      - SELL_RATIO=${SELL_RATIO}
      - WALLET_ADDRESSES=${WALLET_ADDRESSES}
      - PEAK_HOURS=${PEAK_HOURS}
    restart: unless-stopped
```

3. Build and run:
```bash
docker-compose up -d
```

## Cloud Deployment

### AWS EC2

1. Launch an EC2 instance:
```bash
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t2.micro \
    --key-name your-key-pair \
    --security-group-ids sg-xxxxxxxx
```

2. Connect to the instance:
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

3. Install dependencies:
```bash
sudo yum update -y
sudo yum install -y nodejs npm
```

4. Deploy the bot:
```bash
git clone https://github.com/A12RGA1645773/pump-fun-volume-bot.git
cd pump-fun-volume-bot
npm install
npm run build
```

5. Create a systemd service:
```ini
[Unit]
Description=Pump Fun Volume Bot
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/pump-fun-volume-bot
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

6. Start the service:
```bash
sudo systemctl enable pump-fun-bot
sudo systemctl start pump-fun-bot
```

### Google Cloud Run

1. Create a Dockerfile (as shown above)

2. Build and push the container:
```bash
gcloud builds submit --tag gcr.io/your-project/pump-fun-bot
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy pump-fun-bot \
    --image gcr.io/your-project/pump-fun-bot \
    --platform managed \
    --set-env-vars="PUMPFUN_API_KEY=your-api-key"
```

## Monitoring

### Local Monitoring

1. Check logs:
```bash
tail -f logs/bot.log
```

2. Monitor metrics:
```bash
curl http://localhost:3000/metrics
```

### Cloud Monitoring

1. AWS CloudWatch:
```bash
aws cloudwatch put-metric-data \
    --namespace PumpFunBot \
    --metric-name Volume \
    --value 1000
```

2. Google Cloud Monitoring:
```bash
gcloud monitoring metrics create \
    --display-name="Bot Volume" \
    --type="custom.googleapis.com/pumpfun/volume"
```

## Backup and Recovery

### Configuration Backup

1. Backup environment file:
```bash
cp .env .env.backup
```

2. Backup wallet addresses:
```bash
cp wallets.json wallets.json.backup
```

### Database Backup

1. Backup metrics:
```bash
mongodump --db pumpfun --out ./backup
```

2. Restore metrics:
```bash
mongorestore --db pumpfun ./backup/pumpfun
```

## Security

### API Key Management

1. Use environment variables
2. Rotate keys regularly
3. Use key vault services

### Network Security

1. Use HTTPS
2. Implement rate limiting
3. Monitor for suspicious activity

### Access Control

1. Use IAM roles
2. Implement least privilege
3. Regular access reviews

## Maintenance

### Regular Updates

1. Check for updates:
```bash
npm outdated
```

2. Update dependencies:
```bash
npm update
```

3. Test updates:
```bash
npm test
```

### Performance Optimization

1. Monitor resource usage
2. Optimize trading patterns
3. Adjust configuration

### Troubleshooting

1. Check logs
2. Monitor metrics
3. Review error reports

## Support

For deployment support:
- Join our Discord community
- Check the troubleshooting guide
- Open an issue on GitHub

## Updates

This guide will be regularly updated with:
- New deployment options
- Best practices
- Security recommendations
- Performance optimizations 