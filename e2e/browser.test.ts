import { test, expect } from '@playwright/test';

test.describe('Browser E2E — Declarative meta page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?page=meta');
    await page.waitForSelector('#page-indicator');
  });

  test('sets document title', async ({ page }) => {
    await expect(page).toHaveTitle('E2E Test Page');
  });

  test('renders meta charset', async ({ page }) => {
    const charset = page.locator('head meta[charset]');
    await expect(charset).toHaveAttribute('charset', 'utf-8');
  });

  test('renders meta description', async ({ page }) => {
    const desc = page.locator('head meta[name="description"]');
    await expect(desc).toHaveAttribute('content', 'E2E test description');
  });

  test('renders og:title meta', async ({ page }) => {
    const og = page.locator('head meta[property="og:title"]');
    await expect(og).toHaveAttribute('content', 'E2E OG Title');
  });

  test('renders canonical link', async ({ page }) => {
    const link = page.locator('head link[rel="canonical"]');
    await expect(link).toHaveAttribute('href', 'https://example.com/e2e');
  });

  test('renders stylesheet link', async ({ page }) => {
    const link = page.locator('head link[rel="stylesheet"]');
    await expect(link).toHaveAttribute('href', '/test.css');
  });

  test('renders base tag', async ({ page }) => {
    const base = page.locator('head base');
    await expect(base).toHaveAttribute('href', 'https://example.com/');
  });

  test('renders inline style', async ({ page }) => {
    const style = page.locator('head style');
    const text = await style.textContent();
    expect(text).toContain('background: red');
  });

  test('renders inline script', async ({ page }) => {
    const script = page.locator('head script[type="application/ld+json"]');
    const text = await script.textContent();
    expect(text).toContain('"@context"');
  });

  test('sets html attributes', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
    const cls = await page.locator('html').getAttribute('class');
    expect(cls).toContain('e2e-html');
  });

  test('sets body attributes', async ({ page }) => {
    const cls = await page.locator('body').getAttribute('class');
    expect(cls).toContain('e2e-body');
    const dataPage = await page.locator('body').getAttribute('data-page');
    expect(dataPage).toBe('meta');
  });
});

test.describe('Browser E2E — Title template page', () => {
  test('applies titleTemplate', async ({ page }) => {
    await page.goto('/?page=title-template');
    await page.waitForSelector('#title-template-content');
    await expect(page).toHaveTitle('Site Name - Templated');
  });
});

test.describe('Browser E2E — API props page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?page=api');
    await page.waitForSelector('#page-indicator');
  });

  test('sets title via prop', async ({ page }) => {
    await expect(page).toHaveTitle('API Title');
  });

  test('sets meta via prop array', async ({ page }) => {
    const robots = page.locator('head meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', 'noindex');

    const ogUrl = page.locator('head meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute('content', 'https://example.com/api');
  });

  test('sets link via prop array', async ({ page }) => {
    const link = page.locator('head link[rel="canonical"]');
    await expect(link).toHaveAttribute('href', 'https://example.com/api');
  });

  test('sets html lang via htmlAttributes', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('fr');
  });

  test('sets body class via bodyAttributes', async ({ page }) => {
    const cls = await page.locator('body').getAttribute('class');
    expect(cls).toContain('api-body');
  });
});

test.describe('Browser E2E — Nested Helmet components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?page=nested');
    await page.waitForSelector('#page-indicator');
  });

  test('innermost title wins', async ({ page }) => {
    await expect(page).toHaveTitle('Inner Title');
  });

  test('innermost description wins', async ({ page }) => {
    const desc = page.locator('head meta[name="description"]');
    await expect(desc).toHaveAttribute('content', 'Inner description');
  });

  test('keywords from inner component are present', async ({ page }) => {
    const kw = page.locator('head meta[name="keywords"]');
    await expect(kw).toHaveAttribute('content', 'inner,nested');
  });
});
