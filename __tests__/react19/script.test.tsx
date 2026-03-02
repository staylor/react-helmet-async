import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – script tags', () => {
  describe('API', () => {
    it('renders script tags with src', () => {
      render(
        <Helmet
          script={[
            { src: 'http://localhost/test.js', type: 'text/javascript' },
            { src: 'http://localhost/test2.js', type: 'text/javascript' },
          ]}
        />
      );

      const scripts = getMountElement().querySelectorAll('script');
      expect(scripts.length).toBe(2);

      expect(scripts[0]).toHaveAttribute('src', 'http://localhost/test.js');
      expect(scripts[0]).toHaveAttribute('type', 'text/javascript');
      expect(scripts[1]).toHaveAttribute('src', 'http://localhost/test2.js');
    });

    it('renders script tags with innerHTML', () => {
      const scriptContent = `{"@context":"http://schema.org"}`;
      render(<Helmet script={[{ type: 'application/ld+json', innerHTML: scriptContent }]} />);

      const script = getMountElement().querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      expect(script!.innerHTML).toBe(scriptContent);
    });

    it('renders no script tags when none are specified', () => {
      render(<Helmet />);

      const scripts = getMountElement().querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });
  });

  describe('Declarative API', () => {
    it('renders script tags from children', () => {
      render(
        <Helmet>
          <script src="http://localhost/test.js" type="text/javascript" />
        </Helmet>
      );

      const scripts = getMountElement().querySelectorAll('script');
      expect(scripts.length).toBe(1);
      expect(scripts[0]).toHaveAttribute('src', 'http://localhost/test.js');
      expect(scripts[0]).toHaveAttribute('type', 'text/javascript');
    });

    it('renders inline script from children', () => {
      const scriptContent = `alert('hello')`;
      render(
        <Helmet>
          <script type="text/javascript">{scriptContent}</script>
        </Helmet>
      );

      const script = getMountElement().querySelector('script[type="text/javascript"]');
      expect(script).not.toBeNull();
      expect(script!.innerHTML).toBe(scriptContent);
    });
  });
});
