import { createXai } from '@ai-sdk/xai';
import { config } from 'dotenv';
import { streamText } from 'ai';

// Configure XAI with debug logging
const customXai = createXai({
  apiKey: process.env.XAI_API_KEY,
  headers: {
    'Content-Type': 'application/json',
  },
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    console.log('Making request to:', input.toString());
    console.log('Request options:', {
      method: init?.method,
      headers: init?.headers,
      body: init?.body ? JSON.parse(init.body.toString()) : undefined,
    });

    const response = await fetch(input, init);
    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      throw new Error(`XAI API request failed: ${error}`);
    }

    return response;
  },
});

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testXaiAPI() {
  try {
    console.log('Testing XAI API integration...');

    // Check if API key is present
    if (!process.env.XAI_API_KEY) {
      throw new Error('XAI_API_KEY is not set in environment variables');
    }

    // Test chat model
    console.log('\nTesting xai-chat model...');
    console.log('Using API key:', `${process.env.XAI_API_KEY?.slice(0, 8)}...`);

    try {
      const chatModel = customXai('xai-chat');
      console.log('Chat model:', chatModel.modelId);

      const chatResult = await streamText({
        model: chatModel,
        messages: [
          { role: 'user', content: 'Hello, what features do you offer?' },
        ],
        maxTokens: 1000,
        temperature: 0.7,
      });

      console.log('Chat model output:');
      try {
        const reader = chatResult.textStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          process.stdout.write(value);
        }
      } catch (streamError) {
        console.error('Error reading chat stream:', streamError);
      }
    } catch (error) {
      console.error('Error in chat model execution:', error);
    }

    // Test reasoning model
    console.log('\n\nTesting xai-reasoning model...');
    try {
      const reasoningModel = customXai('xai-reasoning');
      console.log('Reasoning model:', reasoningModel.modelId);

      const reasoningResult = await streamText({
        model: reasoningModel,
        messages: [
          {
            role: 'user',
            content:
              'Solve this problem step by step: If a train travels at 60 mph for 2 hours, how far does it go?',
          },
        ],
        maxTokens: 1000,
        temperature: 0.7,
      });

      console.log('Reasoning model output:');
      try {
        const reader = reasoningResult.textStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          process.stdout.write(value);
        }
      } catch (streamError) {
        console.error('Error reading reasoning stream:', streamError);
      }
    } catch (error) {
      console.error('Error in reasoning model execution:', error);
    }

    // Test error handling with invalid API key
    console.log('\n\nTesting error handling with invalid API key...');
    try {
      const invalidXai = createXai({
        apiKey: 'invalid_api_key',
      });

      const invalidModel = invalidXai('xai-chat');

      await streamText({
        model: invalidModel,
        messages: [{ role: 'user', content: 'This should fail' }],
        maxTokens: 10,
      });

      console.error('Error: Test should have failed but succeeded');
    } catch (error) {
      console.log(
        'Successfully caught error with invalid API key:',
        error instanceof Error ? error.message : String(error),
      );
    }

    console.log('\nAPI test successful!');
  } catch (error) {
    console.error('Error testing XAI API:', error);
    process.exit(1);
  }
}

// Add script to package.json: "test:xai": "tsx scripts/test-xai.ts"
testXaiAPI();
