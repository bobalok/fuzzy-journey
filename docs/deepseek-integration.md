# DeepSeek Chat API Integration Guide

This guide documents the steps taken to integrate DeepSeek's language models into Tiger.Chat.

## Prerequisites

- DeepSeek API key (get it from [DeepSeek Platform](https://platform.deepseek.com))
- Sufficient credits in your DeepSeek account
- Node.js and pnpm installed

## Integration Steps

### 1. Install Dependencies

```bash
pnpm add @ai-sdk/deepseek
```

### 2. Environment Configuration

1. Add DeepSeek API key to `.env.local`:

```env
DEEPSEEK_API_KEY=your-api-key-here
```

2. Update `.env.example` to document the requirement:

```env
# Get your DeepSeek API Key here: https://platform.deepseek.com/api-keys
DEEPSEEK_API_KEY=****
```

3.  Configure Next.js to expose the API key to the server in `next.config.ts`:

```typescript
serverRuntimeConfig: {
  // Server-only environment variables
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
}
```

### 3. Model Configuration

1. Define DeepSeek models in `lib/ai/models.ts`:

```typescript
export const chatModels: Array<ChatModel> = [
  // ...existing models...
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    description: 'DeepSeek Chat model',
  },
  {
    id: 'deepseek-reasoning',
    name: 'DeepSeek Reasoning',
    description: 'DeepSeek model with reasoning capabilities',
  },
];
```

### 4. Provider Configuration

Configure the DeepSeek provider in `lib/ai/providers.ts`:
```typescript
import { deepseek } from '@ai-sdk/deepseek';

// In the languageModels configuration:
'deepseek-chat': deepseek('deepseek-chat'),
'deepseek-reasoning': wrapLanguageModel({
  model: deepseek('deepseek-reasoner'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
}),
```

### 5. API Route Updates

Update the chat API route in `app/(chat)/api/chat/route.ts` to:

1. Check for DeepSeek API key when using DeepSeek models
2. Add error handling for API key issues
3. Configure proper stream handling

```typescript
// Check if using DeepSeek model without API key
const isDeepSeekModel = selectedChatModel.startsWith('deepseek-');
if (isDeepSeekModel && !process.env.DEEPSEEK_API_KEY) {
  throw new Error('Missing DEEPSEEK_API_KEY environment variable');
}
```

### 6. User Entitlements

Update `lib/ai/entitlements.ts` to specify which user types have access to DeepSeek models:

```typescript
export const entitlementsByUserType: Record<UserType, Entitlements> = {
  user: {
    availableChatModelIds: ['chat-model', 'deepseek-chat'],
    // ...other entitlements
  },
  admin: {
    availableChatModelIds: ['chat-model', 'chat-model-reasoning', 'deepseek-chat', 'deepseek-reasoning'],
    // ...other entitlements
  },
};
```

### 7. Testing

1. Create a test script at `scripts/test-deepseek.ts` to verify the integration:

```typescript
import { createDeepSeek } from '@ai-sdk/deepseek';
import { config } from 'dotenv';
import { streamText } from 'ai';

// Test both chat and reasoning models
// Implement proper error handling and stream processing
```

2. Run the test script:

```bash
NODE_ENV=development pnpm tsx scripts/test-deepseek.ts
```

## Usage Requirements

1. DeepSeek API Key:
   - Must be obtained from [DeepSeek Platform](https://platform.deepseek.com)
   - Should have sufficient credits
   - Must be added to environment variables

2. Model Selection:
   - 'deepseek-chat': General purpose chat model
   - 'deepseek-reasoning': Enhanced model with reasoning capabilities

3. Error Handling:
   - Check for API key presence
   - Handle insufficient credits errors
   - Proper stream processing

## Troubleshooting

1. API Key Issues:
   - Verify API key is properly set in environment
   - Check API key format and validity

2. Credit Issues:
   - Check account balance on DeepSeek Platform
   - Add credits if receiving 402 Insufficient Balance errors

3. Stream Issues:
   - Verify proper stream handling in API route
   - Check for connection timeouts
   - Monitor response formats

## References

- [DeepSeek Platform Documentation](https://platform.deepseek.com/docs)
- [AI SDK Documentation](https://ai-sdk.js.org)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
