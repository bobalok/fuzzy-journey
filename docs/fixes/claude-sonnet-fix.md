# Claude 3.7 Sonnet Integration Fix

## Summary

We fixed an issue that prevented users from using the Claude 3.7 Sonnet model via OpenRouter in Tiger.Chat.

**Issue**: The Claude 3.7 Sonnet model was properly defined in `models.ts` and the provider path was correctly configured in `providers.ts` using hyphens (`anthropic/claude-3-7-sonnet`), but the model ID was missing from the API validation schema, causing the API to reject requests when users selected this model.

**Fix**: Added the model ID `openrouter-claude-sonnet` to the allowed values in the `selectedChatModel` enum in `/app/(chat)/api/chat/schema.ts`.

## Technical Details

### Problem

The model was defined in the following locations correctly:

1. `lib/ai/models.ts` - Defined with ID `openrouter-claude-sonnet` and name "Claude 3.7 Sonnet"
2. `lib/ai/providers.ts` - Mapped to proper OpenRouter path `anthropic/claude-3-7-sonnet`
3. `lib/ai/entitlements.ts` - Added to the available models for regular users

However, it was missing from the validation schema:
- In `app/(chat)/api/chat/schema.ts`, the model ID wasn't included in the `selectedChatModel` enum, causing API validation to fail

### Solution

Updated the validation schema in `app/(chat)/api/chat/schema.ts` to include the `openrouter-claude-sonnet` model ID:

```typescript
selectedChatModel: z.enum([
  'chat-model',
  'chat-model-reasoning',
  'deepseek-chat',
  'deepseek-reasoning',
  'openrouter-gpt4',
  'openrouter-gpt4-reasoning',
  'openrouter-claude',
  'openrouter-claude-sonnet', // Added this line
  'openrouter-llama',
  'openrouter-mistral',
]),
```

### Testing

The fix can be verified by:

1. Opening the model selector in the chat interface
2. Selecting "Claude 3.7 Sonnet"
3. Sending a message and verifying that the request succeeds
4. Alternatively, running the test script: `pnpm tsx scripts/test-claude-sonnet.ts`

## Best Practices

This incident highlights the importance of:

1. **Complete Validation**: When adding new models, ensure they're added to all relevant validation schemas
2. **Schema Synchronization**: Keep model definitions, providers, entitlements, and validation schemas in sync
3. **Testing**: After adding a new model, test it thoroughly with the test script and manual verification

## Future Improvements

To prevent similar issues in the future:

1. Consider generating the schema enum from the model definitions to keep them in sync
2. Add automated tests that verify all defined models pass schema validation
3. Create a checklist for model integration that includes updating all necessary files
