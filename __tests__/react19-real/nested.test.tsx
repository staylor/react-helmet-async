import React from 'react';
import { renderToString } from 'react-dom/server';

import { Helmet } from '../../src';
import { render } from '../utils';

// The react-19 Vitest project runs this file on React 19 itself, so React hoists <title>,
// <meta> and <link> into <head>, and renders the other tags in place.
describe('React 19 – nested Helmets', () => {
  it('runs on React 19', () => {
    expect(React.version).toMatch(/^19\./);
  });

  it('renders one <title>, formatted with the nearest titleTemplate', () => {
    render(
      <>
        <Helmet titleTemplate="%s | Site" defaultTitle="Site" />
        <div>
          <Helmet>
            <title>Home</title>
          </Helmet>
        </div>
      </>
    );

    expect(document.head.querySelectorAll('title')).toHaveLength(1);
    expect(document.title).toBe('Home | Site');
  });

  it('falls back to defaultTitle once no Helmet sets a title', () => {
    render(
      <>
        <Helmet titleTemplate="%s | Site" defaultTitle="Site" />
        <Helmet>
          <title>Home</title>
        </Helmet>
      </>
    );
    render(<Helmet titleTemplate="%s | Site" defaultTitle="Site" />);

    expect(document.head.querySelectorAll('title')).toHaveLength(1);
    expect(document.title).toBe('Site');
  });

  it('renders each tag once per primary attribute, from the innermost Helmet', () => {
    render(
      <>
        <Helmet>
          <base href="https://example.com/" />
          <meta name="description" content="Outer description" />
          <meta property="og:site_name" content="Site" />
          <link rel="canonical" href="https://example.com/" />
          <script type="application/ld+json">{`{"@type":"WebSite"}`}</script>
          <style>{`body { color: red; }`}</style>
          <noscript>{`<img src="/pixel.gif" />`}</noscript>
        </Helmet>
        <div>
          <Helmet>
            <base href="https://example.com/page/" />
            <meta name="description" content="Inner description" />
            <link rel="canonical" href="https://example.com/page" />
            <script type="application/ld+json">{`{"@type":"WebSite"}`}</script>
            <style>{`body { color: red; }`}</style>
            <noscript>{`<img src="/pixel.gif" />`}</noscript>
          </Helmet>
        </div>
      </>
    );

    const descriptions = document.head.querySelectorAll('meta[name="description"]');
    expect(descriptions).toHaveLength(1);
    expect(descriptions[0]).toHaveAttribute('content', 'Inner description');
    expect(document.head.querySelectorAll('meta[property="og:site_name"]')).toHaveLength(1);

    const canonicals = document.head.querySelectorAll('link[rel="canonical"]');
    expect(canonicals).toHaveLength(1);
    expect(canonicals[0]).toHaveAttribute('href', 'https://example.com/page');

    const bases = document.querySelectorAll('base');
    expect(bases).toHaveLength(1);
    expect(bases[0]).toHaveAttribute('href', 'https://example.com/page/');

    expect(document.querySelectorAll('script')).toHaveLength(1);
    expect(document.querySelectorAll('style')).toHaveLength(1);
    expect(document.querySelectorAll('noscript')).toHaveLength(1);
  });

  it('renders a tag object passed to two Helmets once', () => {
    const siteName = { property: 'og:site_name', content: 'Site' };
    render(
      <>
        <Helmet meta={[siteName]} />
        <Helmet meta={[siteName, { name: 'description', content: 'Page' }]} />
      </>
    );

    expect(document.head.querySelectorAll('meta[property="og:site_name"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  });

  it('renders its tags on the server, where no Helmet mounts', () => {
    const html = renderToString(
      <Helmet titleTemplate="%s | Site">
        <title>Home</title>
        <meta name="description" content="Home description" />
      </Helmet>
    );

    expect(html).toContain('<title>Home | Site</title>');
    expect(html).toContain('<meta name="description" content="Home description"/>');
  });
});
