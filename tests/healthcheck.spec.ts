import { test, expect } from '@playwright/test'

test('homepage health', async ({ page }) => {
  const res = await page.goto('/')

  expect(res?.status()).toBe(200)
})

test('healthcheck api health', async ({ request }) => {
  const res = await request.get('/api/healthcheck')

  expect(res?.status()).toBe(200)
})

test('anime search page health', async ({ page }) => {
  const res = await page.goto('/anime')

  expect(res?.status()).toBe(200)

  const results = page.getByTestId('results')

  await expect(results).not.toBeEmpty()
})

test('watchlists search page health', async ({ page }) => {
  const res = await page.goto('/watchlists')

  expect(res?.status()).toBe(200)

  const results = page.getByTestId('results')

  await expect(results).not.toBeEmpty()
})
