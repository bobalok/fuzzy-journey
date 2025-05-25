import { generateDummyPassword } from './db/utils';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

export const guestRegex = /^guest-\d+$/;

// API key availability checks
export const hasXaiApiKey = Boolean(process.env.XAI_API_KEY);
export const hasDeepseekApiKey = Boolean(process.env.DEEPSEEK_API_KEY);

// Log warning if required API keys are missing (only in development to avoid cluttering logs)
if (isDevelopmentEnvironment && !isTestEnvironment) {
  if (!hasDeepseekApiKey) {
    console.warn(
      'DEEPSEEK_API_KEY environment variable is not set. DeepSeek models will not work correctly.',
    );
  }
  if (!hasXaiApiKey) {
    console.warn(
      'XAI_API_KEY environment variable is not set. XAI models will not work correctly.',
    );
  }
}

export const DUMMY_PASSWORD = generateDummyPassword();
