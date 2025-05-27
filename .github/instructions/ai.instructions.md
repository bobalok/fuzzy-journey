---
applyTo: '**'
---
# AI Model Integration Guidelines for Tig## API Integration

**Location:** `app/(chat)/api/chat/route.ts`

Required checks:

- API key validation
- Provider-specific error handling
- Stream handling configuration
- Rate limiting integration

**Location:** `app/(chat)/api/chat/schema.ts` 

Required updates:

- Add the model ID to the `selectedChatModel` enum to ensure API validation accepts the model
- Example:
```typescript
selectedChatModel: z.enum([
  // existing models...
  'openrouter-claude-sonnet', // New model
]),
```# Overview

This document outlines the standards and procedures for integrating new AI models into Tiger.Chat. All new AI model integrations must follow these guidelines to maintain consistency and reliability across the application.

## Complete Integration Checklist

✅ Define model in `lib/ai/models.ts`  
✅ Configure provider in `lib/ai/providers.ts`  
✅ Update entitlements in `lib/ai/entitlements.ts`  
✅ Add model ID to validation schema in `app/(chat)/api/chat/schema.ts`  
✅ Create test script in `scripts/test-{model}.ts`  
✅ Document integration in `docs/{model}-integration.md`  
✅ Set up proper environment variables  
✅ Test model selection in the UI  

## Model Integration Structure

### 1. Environment Configuration

- All API keys must be stored in environment variables
- Add new API keys to both `.env.local` and `.env.example`
- Update `next.config.ts` with new environment variables under `serverRuntimeConfig`
- Follow the naming convention: `PROVIDER_API_KEY` (e.g., `DEEPSEEK_API_KEY`, `OPENROUTER_API_KEY`)

### 2. Provider Configuration

**Location:** `lib/ai/providers.ts`

```typescript
// Standard import pattern
import { provider } from '@ai-sdk/provider-name';

// Provider configuration
export const myProvider = customProvider({
  languageModels: {
    'provider-model-name': provider('model-id'),
    'provider-model-reasoning': wrapLanguageModel({
      model: provider('model-id'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
  },
});
```

### 3. Model Definition

**Location:** `lib/ai/models.ts`

```typescript
export const chatModels: Array<ChatModel> = [
  {
    id: 'provider-model-name',
    name: 'Display Name',
    description: 'Model description',
  },
];
```

### 4. API Integration

**Location:** `app/(chat)/api/chat/route.ts`

Required checks:

- API key validation
- Provider-specific error handling
- Stream handling configuration
- Rate limiting integration

## Testing Requirements

### 1. Test Script

- Create a test script in `scripts/test-{provider}.ts`
- Test both chat and reasoning capabilities
- Implement proper error handling
- Test stream processing
- Verify correct model path format (e.g., using hyphens for anthropic/claude-3-7-sonnet)

Example test script structure:
```typescript
// scripts/test-claude-sonnet.ts
import { streamText } from 'ai';
import { openrouter } from '../lib/ai/providers/openrouter';

const modelId = 'openrouter-claude-sonnet';
const modelName = 'anthropic/claude-3-7-sonnet'; // Correct path format with hyphens

const result = await streamText({
  model: openrouter(modelName),
  messages: [
    { role: 'user', content: 'Your prompt here' }
  ],
});
```

### 2. Integration Tests

- Add E2E tests in `tests/e2e`
- Test model selection in UI
- Test API validation with the new model
- Test error scenarios
- Test streaming responses

## Code Style Requirements

### Error Handling

```typescript
// Always implement these checks
if (isProviderModel && !process.env.PROVIDER_API_KEY) {
  throw new Error('Missing PROVIDER_API_KEY environment variable');
}

try {
  // API calls
} catch (error) {
  // Proper error handling with specific error types
}
```

### Stream Processing

```typescript
// Standard stream handling pattern
const result = await streamText({
  model: provider('model-id'),
  messages: [...],
  maxTokens: 1000,
  temperature: 0.7,
});

for await (const chunk of result.textStream) {
  // Process stream chunks
}
```

## Documentation Requirements

### 1. Integration Documentation

Create a Markdown file in `docs/{model}-integration.md` with:

- Setup instructions
- Configuration details
- Files modified during integration (complete list)
- Usage examples
- Troubleshooting guide including common issues
- API reference

Example documentation structure:
```markdown
# Model Integration

## Overview
Brief description of the model and its capabilities

## Integration Details
- Model Name: Display name
- Model ID: ID used in Tiger.Chat
- Provider Path: Exact path used with provider (e.g., anthropic/claude-3-7-sonnet)

## Configuration
### Files Modified
1. `lib/ai/models.ts` - Added model definition
2. `lib/ai/providers.ts` - Added provider mapping
3. `lib/ai/entitlements.ts` - Updated entitlements
4. `app/(chat)/api/chat/schema.ts` - Updated validation schema

## Troubleshooting
### Common Issues
- List of common issues and their solutions
```

### 2. Code Comments

- Add JSDoc comments for public functions
- Document error handling approaches
- Explain provider-specific configurations
- Include comments about required validation steps

## Security Guidelines

### API Key Management

- Never commit API keys to the repository
- Use environment variables for all sensitive data
- Implement proper key rotation procedures

### Rate Limiting

- Implement per-user rate limiting
- Add usage tracking
- Handle quota exceeded errors

### Security Error Handling

- Sanitize error messages
- Log security-relevant events
- Implement proper fallbacks

## Performance Guidelines

### Stream Processing Optimization

- Implement proper backpressure handling
- Monitor memory usage
- Handle connection timeouts

### Caching

- Implement response caching where appropriate
- Use streaming for large responses
- Monitor response times

## Monitoring and Maintenance

### Logging

- Log API calls and responses
- Track usage metrics
- Monitor error rates

### Health Checks

- Implement provider health checks
- Monitor API status
- Track response times

### Updates

- Regular dependency updates
- API version monitoring
- Breaking changes tracking

## Quality Assurance

### Before Integration

- [ ] API key validation
- [ ] Error handling implementation
- [ ] Stream processing testing
- [ ] Documentation creation
- [ ] Security review
- [ ] Performance testing

### After Integration

- [ ] E2E tests passing
- [ ] Load testing completed
- [ ] Documentation reviewed
- [ ] API validation in schema.ts verified
- [ ] Security scan completed
- [ ] Performance metrics reviewed
- [ ] Manual testing of model selection completed

## Version Control

### Branch Strategy

- Feature branches for new integrations
- Integration-specific test branches
- Proper version tagging

### Commit Messages

- Clear, descriptive commit messages
- Reference related issues
- Document breaking changes

## Support and Troubleshooting

### Common Issues

- API key configuration
- Rate limiting
- Stream processing
- Schema validation errors
- Model path format issues (e.g., using periods instead of hyphens)
- Error handling

### Debugging

- Enable debug logging
- Monitor stream states
- Track API responses
- Use the test script to verify model connectivity
- Check browser console for validation errors
- Verify schema.ts includes the model ID

## Lessons from Previous Issues

### Claude 3.7 Sonnet Integration Fix (May 2025)

- **Issue**: Model ID missing from API validation schema causing requests to be rejected
- **Root Cause**: Incomplete model integration - schema.ts not updated
- **Resolution**: Added model ID to `selectedChatModel` enum in schema.ts
- **Key Learning**: Always ensure model IDs are added to all validation schemas
- **Prevention**: Follow the complete integration checklist at the top of this document
