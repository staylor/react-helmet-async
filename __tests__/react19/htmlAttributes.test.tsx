import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – html attributes', () => {
  describe('API', () => {
    it('applies html attributes to <html> via DOM manipulation', () => {
      render(
        <Helmet
          htmlAttributes={{
            lang: 'en',
            class: 'myClassName',
          }}
        />
      );

      const htmlTag = document.documentElement;
      expect(htmlTag).toHaveAttribute('lang', 'en');
      expect(htmlTag).toHaveAttribute('class', 'myClassName');
      expect(htmlTag).toHaveAttribute('data-rh-managed', 'lang,class');
    });

    it('updates html attributes on re-render', () => {
      render(<Helmet htmlAttributes={{ lang: 'en' }} />);

      expect(document.documentElement).toHaveAttribute('lang', 'en');

      render(<Helmet htmlAttributes={{ lang: 'ja' }} />);

      expect(document.documentElement).toHaveAttribute('lang', 'ja');
    });

    it('removes html attributes that are no longer present', () => {
      render(<Helmet htmlAttributes={{ lang: 'en', class: 'test' }} />);

      expect(document.documentElement).toHaveAttribute('lang', 'en');
      expect(document.documentElement).toHaveAttribute('class', 'test');

      render(<Helmet htmlAttributes={{ lang: 'en' }} />);

      expect(document.documentElement).toHaveAttribute('lang', 'en');
      expect(document.documentElement).not.toHaveAttribute('class');
    });

    it('cleans up html attributes on unmount', () => {
      render(<Helmet htmlAttributes={{ lang: 'en' }} />);

      expect(document.documentElement).toHaveAttribute('lang', 'en');

      unmount();

      expect(document.documentElement).not.toHaveAttribute('lang');
      expect(document.documentElement).not.toHaveAttribute('data-rh-managed');
    });

    it('handles boolean true attribute', () => {
      render(
        <Helmet
          htmlAttributes={{
            // @ts-ignore
            amp: true,
          }}
        />
      );

      const htmlTag = document.documentElement;
      expect(htmlTag).toHaveAttribute('amp', '');
    });

    it('handles undefined/null/false attributes by removing them', () => {
      render(
        <Helmet
          htmlAttributes={{
            lang: undefined,
          }}
        />
      );

      const htmlTag = document.documentElement;
      expect(htmlTag).not.toHaveAttribute('lang');
    });
  });

  describe('Declarative API', () => {
    it('applies html attributes from <html> child', () => {
      render(
        <Helmet>
          <html lang="en" className="myClassName" />
        </Helmet>
      );

      const htmlTag = document.documentElement;
      expect(htmlTag).toHaveAttribute('lang', 'en');
      expect(htmlTag).toHaveAttribute('class', 'myClassName');
    });
  });
});
