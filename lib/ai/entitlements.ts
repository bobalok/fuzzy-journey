import type { UserType } from '@/app/(auth)/auth';
import type { ChatModel } from './models';

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel['id']>;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: [
      'chat-model',
      'chat-model-reasoning',
      // 'openrouter-gpt4',
      // 'openrouter-gpt4-reasoning',
      // 'openrouter-claude',
      // 'openrouter-claude-sonnet',
      // 'openrouter-llama',
      // 'openrouter-mistral',
    ],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: [
      'chat-model',
      'chat-model-reasoning',
      'deepseek-chat',
      'deepseek-reasoning',
      'openrouter-gpt4',
      'openrouter-gpt4-reasoning',
      'openrouter-claude',
      'openrouter-claude-sonnet',
      'openrouter-llama',
      'openrouter-mistral',
    ],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
