import { streamText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';

// For testing purposes only, hardcoding a temporary API key
// In production, this should always be loaded from environment variables
process.env.OPENROUTER_API_KEY = 'sk-or-v1-xxxxxxxx'; // Replace with actual key for testing

async function testOpenRouter() {
  console.log('Testing OpenRouter with minimal example...');

  try {
    const result = await streamText({
      model: openrouter('openai/gpt-3.5-turbo'),
      messages: [
        {
          role: 'user',
          content: 'Say hello in one sentence.',
        },
      ],
      maxTokens: 100,
    });

    console.log('Response:');
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    console.log('\n\nTest completed successfully');
  } catch (error: any) {
    console.error('Error testing OpenRouter:', error.message);
    if (error.response) {
      console.error('Response details:', error.response.data);
    }
  }
}

testOpenRouter().catch((error) => {
  console.error('Unhandled error:', error);
});
