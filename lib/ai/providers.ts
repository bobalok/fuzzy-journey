import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { deepseek } from '@ai-sdk/deepseek';
import { openrouter } from './providers/openrouter';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': xai('grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai('grok-2-1212'),
        'artifact-model': xai('grok-2-1212'),

        // DeepSeek models
        'deepseek-chat': deepseek('deepseek-chat'),
        'deepseek-reasoning': wrapLanguageModel({
          model: deepseek('deepseek-reasoner'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),

        // OpenRouter models
        'openrouter-gpt4': openrouter('openai/gpt-4-turbo'),
        'openrouter-gpt4-reasoning': wrapLanguageModel({
          model: openrouter('openai/gpt-4-turbo'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'openrouter-claude': openrouter('anthropic/claude-3-opus'),
        'openrouter-claude-sonnet': openrouter('anthropic/claude-3-7-sonnet'),
        'openrouter-llama': openrouter('meta/llama-3-70b-instruct'),
        'openrouter-mistral': openrouter('mistralai/mistral-large'),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
