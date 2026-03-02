import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – meta tags', () => {
  describe('API', () => {
    it('renders meta tags', () => {
      render(
        <Helmet
          meta={[
            { charset: 'utf-8' },
            { name: 'description', content: 'Test description' },
            { 'http-equiv': 'content-type', content: 'text/html' },
            { property: 'og:type', content: 'article' },
            { itemprop: 'name', content: 'Test name itemprop' },
          ]}
        />
      );

      const metas = getMountElement().querySelectorAll('meta');
      expect(metas.length).toBe(5);

      expect(metas[0]).toHaveAttribute('charset', 'utf-8');
      expect(metas[1]).toHaveAttribute('name', 'description');
      expect(metas[1]).toHaveAttribute('content', 'Test description');
      expect(metas[2]).toHaveAttribute('http-equiv', 'content-type');
      expect(metas[2]).toHaveAttribute('content', 'text/html');
      expect(metas[3]).toHaveAttribute('property', 'og:type');
      expect(metas[3]).toHaveAttribute('content', 'article');
      expect(metas[4]).toHaveAttribute('itemprop', 'name');
      expect(metas[4]).toHaveAttribute('content', 'Test name itemprop');
    });

    it('renders no meta tags when none are specified', () => {
      render(<Helmet />);

      const metas = getMountElement().querySelectorAll('meta');
      expect(metas.length).toBe(0);
    });

    it('updates meta tags on re-render', () => {
      render(<Helmet meta={[{ name: 'description', content: 'First' }]} />);

      let meta = getMountElement().querySelector('meta[name="description"]');
      expect(meta).toHaveAttribute('content', 'First');

      render(<Helmet meta={[{ name: 'description', content: 'Second' }]} />);

      meta = getMountElement().querySelector('meta[name="description"]');
      expect(meta).toHaveAttribute('content', 'Second');
    });

    it('renders multiple meta tags from same component', () => {
      render(
        <Helmet
          meta={[
            { name: 'description', content: 'Desc 1' },
            { name: 'description', content: 'Desc 2' },
          ]}
        />
      );

      const metas = getMountElement().querySelectorAll('meta[name="description"]');
      expect(metas.length).toBe(2);
      expect(metas[0]).toHaveAttribute('content', 'Desc 1');
      expect(metas[1]).toHaveAttribute('content', 'Desc 2');
    });
  });

  describe('Declarative API', () => {
    it('renders meta tags from children', () => {
      render(
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content="Test description" />
          <meta httpEquiv="content-type" content="text/html" />
          <meta property="og:type" content="article" />
          <meta itemProp="name" content="Test name itemprop" />
        </Helmet>
      );

      const metas = getMountElement().querySelectorAll('meta');
      expect(metas.length).toBe(5);

      expect(metas[0]).toHaveAttribute('charset', 'utf-8');
      expect(metas[1]).toHaveAttribute('name', 'description');
      expect(metas[1]).toHaveAttribute('content', 'Test description');
      expect(metas[2]).toHaveAttribute('http-equiv', 'content-type');
      expect(metas[3]).toHaveAttribute('property', 'og:type');
      expect(metas[4]).toHaveAttribute('itemprop', 'name');
    });

    it('clears meta tags when children are removed', () => {
      render(
        <Helmet>
          <meta name="description" content="Test" />
        </Helmet>
      );

      expect(getMountElement().querySelectorAll('meta').length).toBe(1);

      render(<Helmet />);

      expect(getMountElement().querySelectorAll('meta').length).toBe(0);
    });
  });
});
