# Claude 3.7 Sonnet Integration

## Overview

This document outlines the integration of Anthropic's Claude 3.7 Sonnet model into Tiger.Chat via OpenRouter. Claude 3.7 Sonnet is Anthropic's latest model that offers a strong balance of intelligence, speed, and price. It's suitable for a wide range of conversational and generative AI applications.

## Integration Details

Claude 3.7 Sonnet has been integrated through OpenRouter, which provides API access to various AI models including those from Anthropic. This integration allows users to access Claude 3.7 Sonnet directly within Tiger.Chat's interface.

### Model Information

- **Model Name**: Claude 3.7 Sonnet
- **Model ID in Tiger.Chat**: `openrouter-claude-sonnet`
- **Provider Path**: `anthropic/claude-3-7-sonnet` (via OpenRouter)
- **Description**: Anthropic Claude 3.7 Sonnet via OpenRouter

## Configuration

### Files Modified

1. **`lib/ai/models.ts`**
   - Added model definition with ID, name, and description

2. **`lib/ai/providers.ts`**
   - Added language model mapping using OpenRouter provider

3. **`lib/ai/entitlements.ts`**
   - Added model to the available models for regular users

4. **`app/(chat)/api/chat/schema.ts`**
   - Added model ID to the API validation schema

### Environment Requirements

- Requires an OpenRouter API key stored in `OPENROUTER_API_KEY` environment variable
- Uses the standard OpenRouter configuration from the providers directory

## Testing

A test script has been created to verify the Claude 3.7 Sonnet integration:

```bash
# Run the test script
pnpm tsx scripts/test-claude-sonnet.ts
```

This script tests:
- Basic connectivity to the model
- Response quality for simple prompts
- Response quality for more complex prompts

## Usage

### Accessing the Model

Regular users can access Claude 3.7 Sonnet through the model selector in the chat interface. Guest users do not have access to this model by default.

### Example Prompts

Claude 3.7 Sonnet performs well on a variety of tasks, including:

1. **Conversational responses**
   - General question answering
   - Personalized assistance

2. **Creative writing**
   - Story generation
   - Content creation

3. **Analysis and reasoning**
   - Data interpretation
   - Problem solving

## Troubleshooting

### Common Issues

- **Model Not Available**: Ensure the user has proper entitlements (regular user)
- **Slow Responses**: May occur due to OpenRouter load or rate limiting
- **API Errors**: Check OpenRouter API key validity and quota limits
- **Schema Validation Errors**: Ensure the model ID is included in the API validation schema (fixed in May 2025)

### Error Handling

Errors from OpenRouter are handled through the standard error handling middleware in the chat route.

### Recent Fixes

- **May 2025**: Fixed schema validation issue that prevented model selection in UI. The model ID was missing from the `selectedChatModel` enum in `app/(chat)/api/chat/schema.ts`, causing API validation to fail when users selected this model. See `/docs/fixes/claude-sonnet-fix.md` for details.

## Maintenance

- Regularly check for updates to the Claude 3.7 Sonnet model or interface changes
- Monitor for any OpenRouter-specific requirements or limitations
- Track usage patterns to ensure optimal configuration
