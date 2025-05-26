# OpenRouter Integration for Tiger.Chat

This document outlines the integration of [OpenRouter](https://openrouter.ai/) with Tiger.Chat, providing access to multiple AI models through a single API.

## Overview

OpenRouter allows Tiger.Chat to access models from various providers including OpenAI, Anthropic, Meta, and Mistral through a single integration. This enables users to choose from a wider range of models without requiring individual API keys for each provider.

## Setup Instructions

### 1. Install Dependencies

The OpenRouter integration uses the official OpenRouter provider for the AI SDK:

```bash
pnpm add @openrouter/ai-sdk-provider
```

### 2. Environment Configuration

Add your OpenRouter API key to your environment:

```bash
# .env.local
OPENROUTER_API_KEY=your_api_key_here
```

You can get an API key from [OpenRouter's website](https://openrouter.ai/keys).

### 2. Models Available

The integration includes the following models:

| Model ID | Display Name | Provider | Description |
|----------|--------------|----------|-------------|
| openrouter-gpt4 | GPT-4 Turbo | OpenAI | OpenAI's GPT-4 Turbo via OpenRouter |
| openrouter-gpt4-reasoning | GPT-4 Turbo (Reasoning) | OpenAI | GPT-4 Turbo with reasoning capabilities |
| openrouter-claude | Claude 3 Opus | Anthropic | Anthropic's Claude 3 Opus model |
| openrouter-llama | Llama 3 70B | Meta | Meta's Llama 3 70B model |
| openrouter-mistral | Mistral Large | Mistral | Mistral Large model |

## Usage Examples

### Basic Chat

```typescript
const response = await streamText({
  model: myProvider.languageModel('openrouter-gpt4'),
  messages: [
    {
      role: 'user',
      content: 'Hello, who are you?',
    },
  ],
});

for await (const chunk of response.textStream) {
  // Process response chunks
}
```

### Using Reasoning Capabilities

```typescript
const response = await streamText({
  model: myProvider.languageModel('openrouter-gpt4-reasoning'),
  messages: [
    {
      role: 'user',
      content: 'Solve this math problem: 247 + 139',
    },
  ],
  system: "You're a helpful AI assistant. Use the <think> tag to show your reasoning.",
});
```

## Troubleshooting

### Common Issues

1. **Missing API Key**
   
   Error: `Missing OPENROUTER_API_KEY environment variable`
   
   Solution: Set the OPENROUTER_API_KEY in your `.env.local` file.

2. **Rate Limiting**
   
   Error: `429 Too Many Requests`
   
   Solution: Reduce the frequency of requests or upgrade your OpenRouter plan.

3. **Invalid Model ID**
   
   Error: `Model not found`
   
   Solution: Check that you're using one of the supported model IDs.

### Testing

To test the OpenRouter integration:

```bash
pnpm tsx scripts/test-openrouter.ts
```

## API Reference

### OpenRouter Provider

```typescript
// lib/ai/providers/openrouter.ts
export const openRouter = customProvider({
  languageModels: {
    'openrouter-gpt4': openRouterProvider('openai/gpt-4-turbo'),
    'openrouter-claude': openRouterProvider('anthropic/claude-3-opus'),
    'openrouter-llama': openRouterProvider('meta/llama-3-70b-instruct'),
    'openrouter-mistral': openRouterProvider('mistralai/mistral-large'),
  },
});
```

### Model Configuration

```typescript
// lib/ai/models.ts
export const chatModels: Array<ChatModel> = [
  // ...existing models
  {
    id: 'openrouter-gpt4',
    name: 'GPT-4 Turbo',
    description: 'OpenAI GPT-4 Turbo via OpenRouter',
  },
  // ...other OpenRouter models
];
```

## Security Considerations

- API keys are stored as environment variables and never exposed to clients
- Rate limiting is handled through the OpenRouter API
- Error messages are sanitized to prevent information leakage
