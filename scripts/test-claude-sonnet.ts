import { streamText } from 'ai';
import { openrouter } from '../lib/ai/providers/openrouter';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testClaudeSonnet() {
  console.log('Testing Claude 3.7 Sonnet via OpenRouter integration...');

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

  const modelId = 'openrouter-claude-sonnet';
  const modelName = 'anthropic/claude-3-7-sonnet';

  console.log(`\nTesting ${modelId} (${modelName})...`);

  try {
    const result = await streamText({
      model: openrouter(modelName),
      messages: [
        {
          role: 'user',
          content:
            'Briefly introduce yourself as Claude 3.7 Sonnet and describe your capabilities. Keep it under 150 words.',
        },
      ],
      maxTokens: 1000,
    });

    console.log(`Response from ${modelId}:`);
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    console.log('\n');

    // Test with more complex prompt
    console.log(`\nTesting ${modelId} with a more complex prompt...`);
    const complexResult = await streamText({
      model: openrouter(modelName),
      messages: [
        {
          role: 'user',
          content:
            'Write a brief comparison between different LLM architectures and their strengths. Include your own architecture if relevant.',
        },
      ],
      maxTokens: 1000,
    });

    console.log(`Response from ${modelId} (complex prompt):`);
    for await (const chunk of complexResult.textStream) {
      process.stdout.write(chunk);
    }
    console.log('\n');
  } catch (error: any) {
    console.error(`Error testing ${modelId}:`, error.message);
  }
}

// Run the test
testClaudeSonnet().catch(console.error);
