# Deployment Guide

This guide covers deploying the Civic DAO application to production environments.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A blockchain wallet with testnet tokens
- Vercel account (for frontend)
- Railway/Heroku account (for backend)
- Polygon Amoy testnet tokens

## Smart Contract Deployment

### 1. Prepare Environment

```bash
cd contracts
cp env.example .env
```

Edit `.env` with your configuration:
```env
PRIVATE_KEY=your_private_key_here
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 2. Deploy Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Polygon Amoy testnet
npx hardhat run scripts/deploy.js --network amoy

# Verify contracts on Polygonscan
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

### 3. Update Contract Addresses

After deployment, update the contract addresses in:
- `frontend/.env.local`
- `backend/.env`

## Frontend Deployment (Vercel)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy to Vercel

```bash
cd frontend
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set build command: npm run build
# - Set output directory: .next
# - Set install command: npm install
```

### 3. Configure Environment Variables

In Vercel dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add all variables from `frontend/env.example`

### 4. Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Backend Deployment (Railway)

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Deploy to Railway

```bash
cd backend
railway login
railway init
railway up
```

### 3. Configure Environment Variables

In Railway dashboard:
1. Go to your project
2. Navigate to Variables
3. Add all variables from `backend/env.example`

### 4. Configure Database

Railway provides MongoDB and Redis:
1. Add MongoDB service
2. Add Redis service
3. Update `MONGODB_URI` and `REDIS_URL` in variables

## Alternative Backend Deployment (Heroku)

### 1. Install Heroku CLI

```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Deploy to Heroku

```bash
cd backend
heroku create civic-dao-backend
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 3. Configure Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-domain.vercel.app
# Add other variables as needed
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend environment

### Redis Cloud

1. Create account at [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a new database
3. Get connection string
4. Update `REDIS_URL` in backend environment

## IPFS Setup (Pinata)

1. Create account at [Pinata](https://pinata.cloud)
2. Get API key and secret
3. Update `IPFS_API_KEY` and `IPFS_SECRET_KEY` in backend environment

## Domain Configuration

### 1. Frontend Domain

If using custom domain:
1. Add domain in Vercel dashboard
2. Configure DNS A record to point to Vercel
3. Enable HTTPS (automatic with Vercel)

### 2. Backend Domain

Railway/Heroku provides subdomains:
- Railway: `civic-dao-backend.railway.app`
- Heroku: `civic-dao-backend.herokuapp.com`

For custom domain:
1. Add domain in platform dashboard
2. Configure DNS CNAME record
3. Enable HTTPS

## SSL Certificates

Both Vercel and Railway/Heroku provide automatic SSL certificates. No additional configuration needed.

## Monitoring and Logs

### Vercel (Frontend)

- View logs in Vercel dashboard
- Monitor performance in Analytics tab
- Set up alerts for errors

### Railway (Backend)

- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

### Heroku (Backend)

```bash
# View logs
heroku logs --tail

# Monitor dyno usage
heroku ps
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Private Keys**: Use environment variables for sensitive data
3. **CORS**: Configure CORS properly for production domains
4. **Rate Limiting**: Enable rate limiting on API endpoints
5. **HTTPS**: Always use HTTPS in production
6. **Database**: Use strong passwords and enable authentication

## Performance Optimization

### Frontend

1. Enable Vercel Analytics
2. Optimize images with Next.js Image component
3. Use CDN for static assets
4. Enable compression

### Backend

1. Enable Redis caching
2. Use database indexing
3. Implement connection pooling
4. Monitor memory usage

## Backup Strategy

1. **Database**: Regular automated backups
2. **IPFS**: Pin important data
3. **Code**: Version control with Git
4. **Environment**: Document all configuration

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **Environment Variables**: Verify all required variables are set
3. **Database Connection**: Check connection strings and credentials
4. **CORS Errors**: Verify frontend URL in backend CORS configuration

### Debug Commands

```bash
# Check frontend build locally
cd frontend && npm run build

# Check backend locally
cd backend && npm start

# Test contracts locally
cd contracts && npx hardhat test
```

## Maintenance

### Regular Tasks

1. Update dependencies monthly
2. Monitor error rates
3. Check database performance
4. Review security logs
5. Update documentation

### Scaling

1. **Frontend**: Vercel handles auto-scaling
2. **Backend**: Upgrade Railway/Heroku plan as needed
3. **Database**: Monitor usage and upgrade as needed
4. **IPFS**: Monitor pin usage and upgrade plan

## Support

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Contact platform support
4. Open GitHub issue for code-related problems
