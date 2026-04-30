import { expect, request, test } from '@playwright/test';

const apiUrl = 'http://127.0.0.1:8000';

test('real-backend smoke opens dashboard against the local API', async ({ page }) => {
  const api = await request.newContext({ baseURL: apiUrl });
  const health = await api.get('/health/live', { timeout: 2_000 }).catch(() => null);
  await api.dispose();

  test.skip(!health?.ok(), 'Backend local não disponível em http://127.0.0.1:8000.');

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Memoriais gerados' })).toBeVisible();
});
