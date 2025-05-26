import { streamText } from 'ai';
import { openrouter } from '../lib/ai/providers/openrouter';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testOpenRouter() {
  console.log('Testing OpenRouter integration...');

  if (!process.env.OPENROUTER_API_KEY) {
    console.error(
      'Error: OPENROUTER_API_KEY not found in environment variables',
    );
    console.error('Please add your OpenRouter API key to .env.local');
    console.error('You can get an API key from: https://openrouter.ai/keys');
    process.exit(1);
  }

  console.log('API Key found in environment variables.');
  console.log(
    'If your tests hang or timeout, please check if your API key is valid.',
  );

  const models = [
    { id: 'openrouter-gpt4', modelName: 'openai/gpt-4-turbo' },
    { id: 'openrouter-claude', modelName: 'anthropic/claude-3-opus' },
    { id: 'openrouter-llama', modelName: 'meta/llama-3-70b-instruct' },
    { id: 'openrouter-mistral', modelName: 'mistralai/mistral-large' },
  ];

  for (const { id, modelName } of models) {
    console.log(`\nTesting ${id} (${modelName})...`);

    try {
      const result = await streamText({
        model: openrouter(modelName),
        messages: [
          {
            role: 'user',
            content:
              'Briefly introduce yourself and say hello. Keep it under 100 words.',
          },
        ],
        maxTokens: 1000,
      });

      console.log(`Response from ${id}:`);
      for await (const chunk of result.textStream) {
        process.stdout.write(chunk);
      }
      console.log('\n');
    } catch (error: any) {
      console.error(`Error testing ${id}:`, error.message);
    }
  }

  console.log(
    '\n\nTesting reasoning capability with openrouter-gpt4-reasoning...',
  );

  try {
    const result = await streamText({
      model: openrouter('openai/gpt-4-turbo'),
      messages: [
        {
          role: 'user',
          content: 'What is 247 + 139? Think step by step.',
        },
      ],
      maxTokens: 1000,
      system: 'Use the <think> tag to show your reasoning process.',
    });

    console.log('Response with reasoning:');
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    console.log('\n');
  } catch (error: any) {
    console.error('Error testing reasoning capability:', error.message);
  }

  console.log('OpenRouter integration test completed');
}

testOpenRouter().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
