import { describe, it, expect } from 'vitest';

import { renderPage } from './fixtures/entry-server';

describe('SSR E2E — meta page', () => {
  const { html, helmet } = renderPage('meta');

  it('renders app HTML', () => {
    expect(html).toContain('id="page-indicator"');
    expect(html).toContain('meta');
  });

  it('produces helmet title', () => {
    const titleStr = helmet!.title.toString();
    expect(titleStr).toContain('<title');
    expect(titleStr).toContain('E2E Test Page');
  });

  it('produces helmet meta tags', () => {
    const metaStr = helmet!.meta.toString();
    expect(metaStr).toContain('charset="utf-8"');
    expect(metaStr).toContain('name="description"');
    expect(metaStr).toContain('E2E test description');
    expect(metaStr).toContain('property="og:title"');
    expect(metaStr).toContain('E2E OG Title');
  });

  it('produces helmet link tags', () => {
    const linkStr = helmet!.link.toString();
    expect(linkStr).toContain('rel="canonical"');
    expect(linkStr).toContain('https://example.com/e2e');
    expect(linkStr).toContain('rel="stylesheet"');
    expect(linkStr).toContain('/test.css');
  });

  it('produces helmet base tag', () => {
    const baseStr = helmet!.base.toString();
    expect(baseStr).toContain('href="https://example.com/"');
  });

  it('produces helmet style', () => {
    const styleStr = helmet!.style.toString();
    expect(styleStr).toContain('background: red');
  });

  it('produces helmet script', () => {
    const scriptStr = helmet!.script.toString();
    expect(scriptStr).toContain('application/ld+json');
    expect(scriptStr).toContain('@context');
  });

  it('produces helmet noscript', () => {
    const noscriptStr = helmet!.noscript.toString();
    expect(noscriptStr).toContain('noscript.css');
  });

  it('produces html attributes', () => {
    const htmlStr = helmet!.htmlAttributes.toString();
    expect(htmlStr).toContain('lang="en"');
    expect(htmlStr).toContain('class="e2e-html"');
  });

  it('produces body attributes', () => {
    const bodyStr = helmet!.bodyAttributes.toString();
    expect(bodyStr).toContain('class="e2e-body"');
    expect(bodyStr).toContain('data-page="meta"');
  });

  it('title toComponent returns React elements', () => {
    const components = helmet!.title.toComponent();
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThan(0);
  });

  it('meta toComponent returns React elements', () => {
    const components = helmet!.meta.toComponent();
    expect(Array.isArray(components)).toBe(true);
    expect(components.length).toBeGreaterThanOrEqual(3);
  });
});

describe('SSR E2E — title template page', () => {
  const { helmet } = renderPage('title-template');

  it('applies titleTemplate', () => {
    const titleStr = helmet!.title.toString();
    expect(titleStr).toContain('Site Name - Templated');
  });
});

describe('SSR E2E — API props page', () => {
  const { helmet } = renderPage('api');

  it('renders title', () => {
    const titleStr = helmet!.title.toString();
    expect(titleStr).toContain('API Title');
  });

  it('renders meta tags', () => {
    const metaStr = helmet!.meta.toString();
    expect(metaStr).toContain('name="robots"');
    expect(metaStr).toContain('noindex');
    expect(metaStr).toContain('property="og:url"');
  });

  it('renders link tags', () => {
    const linkStr = helmet!.link.toString();
    expect(linkStr).toContain('rel="canonical"');
    expect(linkStr).toContain('https://example.com/api');
  });

  it('renders html attributes', () => {
    const htmlStr = helmet!.htmlAttributes.toString();
    expect(htmlStr).toContain('lang="fr"');
  });

  it('renders body attributes', () => {
    const bodyStr = helmet!.bodyAttributes.toString();
    expect(bodyStr).toContain('class="api-body"');
  });
});

describe('SSR E2E — nested page', () => {
  const { helmet } = renderPage('nested');

  it('innermost title wins', () => {
    const titleStr = helmet!.title.toString();
    expect(titleStr).toContain('Inner Title');
    expect(titleStr).not.toContain('Outer Title');
  });

  it('innermost description wins', () => {
    const metaStr = helmet!.meta.toString();
    expect(metaStr).toContain('Inner description');
    expect(metaStr).not.toContain('Outer description');
  });

  it('keywords from inner component are present', () => {
    const metaStr = helmet!.meta.toString();
    expect(metaStr).toContain('inner,nested');
  });
});
