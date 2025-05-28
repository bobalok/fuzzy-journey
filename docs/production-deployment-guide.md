# Tiger.Chat Production Deployment Guide

This guide will walk you through the process of deploying Tiger.Chat to production environments.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- PostgreSQL database
- Redis instance (for stream resumability)
- Vercel Blob Storage or equivalent
- API keys for all required AI services:
  - XAI (Grok AI) 
  - DeepSeek
  - OpenRouter

## Environment Setup

1. Create a production environment file:

```bash
cp .env.production.template .env.production
```

2. Fill in all the required environment variables in `.env.production`:

- `AUTH_SECRET`: Generate using `openssl rand -base64 32`
- `POSTGRES_URL`: Your PostgreSQL connection string
- `XAI_API_KEY`: Your Grok AI API key
- `DEEPSEEK_API_KEY`: Your DeepSeek API key
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `REDIS_URL`: Your Redis connection string
- `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob storage token

3. Verify environment variables:

```bash
pnpm verify:env
```

## Database Setup

1. Run database migrations:

```bash
pnpm db:migrate
```

## Building for Production

```bash
pnpm build:production
```

## Deploying to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
vercel --prod
```

## Deploying with Docker

A Docker Compose setup is available for containerized deployment:

```bash
# Build the production image
docker build -t tiger-chat:production -f docker/Dockerfile .

# Run with Docker Compose
docker-compose -f docker/docker-compose.production.yml up -d
```

## Post-Deployment Verification

After deploying, verify these important components:

1. **Authentication**: Test user login/registration flows
2. **AI Models**: Test all AI model integrations
3. **Database**: Verify database connections and queries
4. **File Storage**: Test file uploads and retrievals

## Monitoring and Logging

- Configure Vercel Analytics for monitoring
- Set up error tracking (e.g., Sentry)
- Implement structured logging for production

## Scaling Considerations

- Use appropriate Vercel plan based on expected traffic
- Configure Redis caching for high traffic scenarios
- Consider sharding for database scaling

## Troubleshooting Common Issues

### API Key Issues

If AI models aren't responding:
- Verify API keys are correctly set in environment variables
- Check API provider status pages for outages
- Review logs for specific error messages

### Database Connection Issues

- Verify PostgreSQL connection string format
- Check database server firewall settings
- Ensure connection limits aren't exceeded

### Stream Resumability Problems

- Verify Redis connection string
- Check Redis instance status
- Ensure Redis has sufficient memory allocation

### Performance Issues

- Enable Vercel Edge Functions for improved latency
- Optimize large database queries
- Review and optimize client-side bundle sizes

## Regular Maintenance

- Update dependencies regularly
- Rotate API keys periodically
- Monitor database performance
- Schedule regular backups

## Security Best Practices

- Keep all API keys secure and rotate regularly
- Implement rate limiting for all endpoints
- Sanitize user inputs
- Use secure cookies for authentication
- Follow OWASP security guidelines

## Support

For issues or questions, please refer to the project documentation or open an issue in the GitHub repository.
