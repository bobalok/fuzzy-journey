import { expect, test } from '../fixtures';
import { ChatPage } from '../pages/chat';

test.describe('OpenRouter Integration', () => {
  test('Test OpenRouter models in chat UI', async ({ page }) => {
    // Setup authentication
    await page.goto('/');

    // Check if models are visible in the model selector
    const chatPage = new ChatPage(page);
    await chatPage.createNewChat();
    await page.getByTestId('model-selector').click();

    // Check if OpenRouter models are available
    await expect(page.getByText('GPT-4 Turbo')).toBeVisible();
    await expect(page.getByText('Claude 3 Opus')).toBeVisible();
    await expect(page.getByText('Llama 3 70B')).toBeVisible();
    await expect(page.getByText('Mistral Large')).toBeVisible();

    // Select GPT-4 Turbo model
    await page.getByTestId('model-selector-item-openrouter-gpt4').click();

    // Type and send a message
    await chatPage.sendUserMessage('Hello, introduce yourself briefly');

    // Since we might not have an actual API key in the test environment,
    // we just verify that the request was sent (error or success)
    await expect(page.getByTestId('message-user')).toBeVisible();
  });

  test('OpenRouter API key error handling', async ({ page }) => {
    // Setup authentication
    await page.goto('/');

    // Set up request interception to simulate missing API key error
    await page.route('**/api/chat', async (route) => {
      const postData = route.request().postData();
      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      if (postData && postData.includes('openrouter')) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            code: 'internal_server_error:chat',
            cause: 'Missing OPENROUTER_API_KEY environment variable',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Setup a chat with OpenRouter model
    const chatPage = new ChatPage(page);
    await chatPage.createNewChat();
    await chatPage.chooseModelFromSelector('openrouter-gpt4');

    // Send message
    await chatPage.sendUserMessage('This should trigger an error');

    // Check for error message in toast or UI
    await expect(page.getByTestId('toast')).toBeVisible({ timeout: 5000 });
  });
});
