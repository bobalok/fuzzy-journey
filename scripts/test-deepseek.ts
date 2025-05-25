import { createDeepSeek } from '@ai-sdk/deepseek';
import { config } from 'dotenv';
import { streamText } from 'ai';

// Configure DeepSeek with debug logging
const customDeepSeek = createDeepSeek({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
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
      throw new Error(`DeepSeek API request failed: ${error}`);
    }

    return response;
  },
});

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testDeepSeekAPI() {
  try {
    console.log('Testing DeepSeek API integration...');

    // Check if API key is present
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is not set in environment variables');
    }

    // Test chat model
    console.log('\nTesting deepseek-chat model...');
    console.log(
      'Using API key:',
      `${process.env.DEEPSEEK_API_KEY?.slice(0, 8)}...`,
    );

    try {
      const chatModel = customDeepSeek('deepseek-chat');
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
    console.log('\n\nTesting deepseek-reasoning model...');
    try {
      const reasoningModel = customDeepSeek('deepseek-reasoner');
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

    console.log('\nAPI test successful!');
  } catch (error) {
    console.error('Error testing DeepSeek API:', error);
    process.exit(1);
  }
}

testDeepSeekAPI();
