# XAI Integration for Tiger.Chat

This document outlines the integration of XAI models into Tiger.Chat.

## Setup Instructions

### 1. Environment Configuration

Add the XAI API key to your environment variables:

```bash
# Add to .env.local
XAI_API_KEY=your_xai_api_key
```

### 2. Dependencies

The project uses the official XAI SDK for integration:

```bash
pnpm add @ai-sdk/xai
```

## Configuration Details

The XAI integration uses the standard AI SDK pattern with two model variants:

1. `xai-chat`: Standard chat model
2. `xai-reasoning`: Chat model with reasoning capabilities

## Usage Examples

### Basic Chat

```typescript
import { xaiProvider } from '@/lib/ai/providers';

const result = await streamText({
  model: xaiProvider.languageModels['xai-chat'],
  messages: [
    { role: 'user', content: 'Hello, what features do you offer?' },
  ],
  maxTokens: 1000,
  temperature: 0.7,
});

// Process stream
for await (const chunk of result.textStream) {
  // Display or process chunk
}
```

### Using Reasoning Capabilities

```typescript
import { xaiProvider } from '@/lib/ai/providers';

const result = await streamText({
  model: xaiProvider.languageModels['xai-reasoning'],
  messages: [
    { 
      role: 'user', 
      content: 'Solve this problem step by step: If a train travels at 60 mph for 2 hours, how far does it go?' 
    },
  ],
  maxTokens: 1000,
  temperature: 0.7,
});

// Process stream
for await (const chunk of result.textStream) {
  // Display or process chunk
}
```

## Troubleshooting Guide

### Common Issues

#### API Key Configuration

If you encounter authentication errors, check the following:

- Verify that `XAI_API_KEY` is correctly set in your `.env.local` file
- Ensure the API key has not expired or been revoked
- Check for typos or unnecessary spaces in the key

#### Rate Limiting

XAI imposes rate limits on API calls. If you encounter rate limiting:

- Implement exponential backoff retry logic
- Monitor usage metrics to stay below limits
- Consider upgrading your API tier for higher limits

#### Stream Processing

If stream processing fails:

- Ensure proper connection handling
- Implement timeout handling
- Check for browser compatibility issues with streaming

## API Reference

### Models

| Model ID | Description | Best For |
|----------|-------------|----------|
| xai-chat | Standard chat model | General conversation, Q&A |
| xai-reasoning | Chat model with reasoning capabilities | Step-by-step solutions, explanations |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| temperature | number | 0.7 | Controls randomness (0-1) |
| maxTokens | number | 1000 | Maximum response length |
| topP | number | 0.95 | Nucleus sampling parameter |

## Security Considerations

- API keys are securely stored in environment variables
- All communication uses HTTPS
- Request validation is implemented to prevent injection attacks
- Error messages are sanitized to prevent information leakage

## Performance Optimization

- Stream responses for better user experience
- Implement caching where appropriate
- Monitor response times and optimize accordingly

## Testing

Run the XAI integration tests:

```bash
pnpm test:xai
```

This will verify:
- API connectivity
- Model capabilities
- Error handling
- Stream processing
