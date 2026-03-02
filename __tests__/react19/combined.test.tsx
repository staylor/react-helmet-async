import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – combined usage', () => {
  it('renders title, meta, link, and base together via API', () => {
    render(
      <Helmet
        title="Full Page"
        base={{ href: 'http://mysite.com/' }}
        meta={[{ charset: 'utf-8' }, { name: 'description', content: 'Full page description' }]}
        link={[{ rel: 'canonical', href: 'http://mysite.com/page' }]}
      />
    );

    const mount = getMountElement();

    const title = mount.querySelector('title');
    expect(title).not.toBeNull();
    expect(title!).toHaveTextContent('Full Page');

    const base = mount.querySelector('base');
    expect(base).not.toBeNull();
    expect(base).toHaveAttribute('href', 'http://mysite.com/');

    const metas = mount.querySelectorAll('meta');
    expect(metas.length).toBe(2);

    const link = mount.querySelector('link[rel="canonical"]');
    expect(link).toHaveAttribute('href', 'http://mysite.com/page');
  });

  it('renders title, meta, link together via Declarative API', () => {
    render(
      <Helmet>
        <title>Declarative Full</title>
        <base href="http://mysite.com/" />
        <meta charSet="utf-8" />
        <meta name="description" content="Declarative description" />
        <link rel="canonical" href="http://mysite.com/page" />
      </Helmet>
    );

    const mount = getMountElement();

    expect(mount.querySelector('title')!).toHaveTextContent('Declarative Full');
    expect(mount.querySelector('base')).toHaveAttribute('href', 'http://mysite.com/');
    expect(mount.querySelectorAll('meta').length).toBe(2);
    expect(mount.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://mysite.com/page'
    );
  });

  it('renders script, style, and noscript together', () => {
    render(
      <Helmet
        script={[{ src: 'http://localhost/test.js', type: 'text/javascript' }]}
        style={[{ cssText: 'body { color: red; }', type: 'text/css' }]}
        noscript={[{ innerHTML: '<p>No JS</p>', id: 'nojs' }]}
      />
    );

    const mount = getMountElement();

    expect(mount.querySelector('script')).toHaveAttribute('src', 'http://localhost/test.js');
    expect(mount.querySelector('style')!.innerHTML).toBe('body { color: red; }');
    expect(mount.querySelector('noscript')!.innerHTML).toBe('<p>No JS</p>');
  });

  it('applies htmlAttributes and bodyAttributes alongside rendered elements', () => {
    render(
      <Helmet
        title="Attrs Page"
        htmlAttributes={{ lang: 'fr' }}
        bodyAttributes={{ className: 'dark' }}
        meta={[{ name: 'theme', content: 'dark' }]}
      />
    );

    const mount = getMountElement();

    expect(mount.querySelector('title')!).toHaveTextContent('Attrs Page');
    expect(mount.querySelector('meta[name="theme"]')).toHaveAttribute('content', 'dark');

    expect(document.documentElement).toHaveAttribute('lang', 'fr');
    expect(document.body).toHaveAttribute('class', 'dark');
  });

  it('handles empty Helmet with no props', () => {
    render(<Helmet />);

    const mount = getMountElement();
    expect(mount.querySelector('title')).toBeNull();
    expect(mount.querySelector('meta')).toBeNull();
    expect(mount.querySelector('link')).toBeNull();
    expect(mount.querySelector('base')).toBeNull();
    expect(mount.querySelector('script')).toBeNull();
    expect(mount.querySelector('style')).toBeNull();
    expect(mount.querySelector('noscript')).toBeNull();
  });

  it('handles multiple Helmet instances rendering separate elements', () => {
    render(
      <div>
        <Helmet title="From First" meta={[{ name: 'author', content: 'Alice' }]} />
        <Helmet meta={[{ name: 'keywords', content: 'react,helmet' }]} />
      </div>
    );

    const mount = getMountElement();

    // Both Helmets render their elements independently
    expect(mount.querySelector('title')!).toHaveTextContent('From First');
    expect(mount.querySelector('meta[name="author"]')).toHaveAttribute('content', 'Alice');
    expect(mount.querySelector('meta[name="keywords"]')).toHaveAttribute('content', 'react,helmet');
  });
});
