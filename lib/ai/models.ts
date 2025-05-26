export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    description: 'DeepSeek Chat model',
  },
  {
    id: 'deepseek-reasoning',
    name: 'DeepSeek Reasoning',
    description: 'DeepSeek model with reasoning capabilities',
  },
  // OpenRouter models
  {
    id: 'openrouter-gpt4',
    name: 'GPT-4 Turbo',
    description: 'OpenAI GPT-4 Turbo via OpenRouter',
  },
  {
    id: 'openrouter-gpt4-reasoning',
    name: 'GPT-4 Turbo (Reasoning)',
    description: 'GPT-4 Turbo with reasoning capabilities via OpenRouter',
  },
  {
    id: 'openrouter-claude',
    name: 'Claude 3 Opus',
    description: 'Anthropic Claude 3 Opus via OpenRouter',
  },
  {
    id: 'openrouter-llama',
    name: 'Llama 3 70B',
    description: 'Meta Llama 3 70B via OpenRouter',
  },
  {
    id: 'openrouter-mistral',
    name: 'Mistral Large',
    description: 'Mistral Large via OpenRouter',
  },
];
