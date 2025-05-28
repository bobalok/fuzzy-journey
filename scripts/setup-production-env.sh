#!/bin/bash

# Script to verify production environment variables are properly configured
# Run this before deploying to production

# Text styling
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking production environment variables configuration..."

# Create array of required env vars
declare -a REQUIRED_VARS=(
  "AUTH_SECRET"
  "POSTGRES_URL"
  "DEEPSEEK_API_KEY"
  "OPENROUTER_API_KEY"
  "XAI_API_KEY"
  "REDIS_URL"
  "BLOB_READ_WRITE_TOKEN"
)

# Track if any required vars are missing
MISSING_VARS=0

# Check if running in Vercel environment
if [ -z "$VERCEL" ]; then
  echo -e "${YELLOW}Not running in Vercel environment. Checking local .env file...${NC}"
  
  # If .env.production file exists, use it; otherwise check .env.local
  if [ -f ".env.production" ]; then
    ENV_FILE=".env.production"
  else
    ENV_FILE=".env.local"
  fi
  
  if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ $ENV_FILE file not found!${NC}"
    exit 1
  fi
  
  echo -e "Using ${ENV_FILE} for configuration check..."
  
  # Source the env file if it exists
  source $ENV_FILE
fi

# Check each required environment variable
for VAR in "${REQUIRED_VARS[@]}"; do
  # Use indirect parameter expansion to check if variable is set
  VALUE=$(eval echo \$$VAR)
  
  if [ -z "$VALUE" ]; then
    echo -e "${RED}❌ $VAR is missing or empty${NC}"
    MISSING_VARS=$((MISSING_VARS + 1))
  else
    # Show first few characters for confirmation, but hide most of the content
    MASKED=${VALUE:0:3}
    echo -e "${GREEN}✅ $VAR is set${NC} ($MASKED...)"
  fi
done

# Summary
if [ $MISSING_VARS -gt 0 ]; then
  echo -e "\n${RED}❌ Found $MISSING_VARS missing required environment variables!${NC}"
  echo -e "Please set all required variables before deploying to production."
  exit 1
else
  echo -e "\n${GREEN}✅ All required environment variables are set!${NC}"
  echo -e "Your environment is ready for production deployment."
fi

# NODE_ENV check
if [ "$NODE_ENV" != "production" ]; then
  echo -e "${YELLOW}⚠️ NODE_ENV is not set to 'production'. Consider setting it for optimized builds.${NC}"
fi

exit 0
