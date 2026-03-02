import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – link tags', () => {
  describe('API', () => {
    it('renders link tags', () => {
      render(
        <Helmet
          link={[
            { href: 'http://localhost/helmet', rel: 'canonical' },
            { href: 'http://localhost/style.css', rel: 'stylesheet', type: 'text/css' },
          ]}
        />
      );

      const links = getMountElement().querySelectorAll('link');
      expect(links.length).toBe(2);

      expect(links[0]).toHaveAttribute('href', 'http://localhost/helmet');
      expect(links[0]).toHaveAttribute('rel', 'canonical');
      expect(links[1]).toHaveAttribute('href', 'http://localhost/style.css');
      expect(links[1]).toHaveAttribute('rel', 'stylesheet');
      expect(links[1]).toHaveAttribute('type', 'text/css');
    });

    it('renders no link tags when none are specified', () => {
      render(<Helmet />);

      const links = getMountElement().querySelectorAll('link');
      expect(links.length).toBe(0);
    });

    it('updates link tags on re-render', () => {
      render(<Helmet link={[{ href: 'http://first.com', rel: 'canonical' }]} />);

      let link = getMountElement().querySelector('link[rel="canonical"]');
      expect(link).toHaveAttribute('href', 'http://first.com');

      render(<Helmet link={[{ href: 'http://second.com', rel: 'canonical' }]} />);

      link = getMountElement().querySelector('link[rel="canonical"]');
      expect(link).toHaveAttribute('href', 'http://second.com');
    });
  });

  describe('Declarative API', () => {
    it('renders link tags from children', () => {
      render(
        <Helmet>
          <link rel="canonical" href="http://localhost/helmet" />
          <link rel="stylesheet" type="text/css" href="http://localhost/style.css" />
        </Helmet>
      );

      const links = getMountElement().querySelectorAll('link');
      expect(links.length).toBe(2);

      expect(links[0]).toHaveAttribute('href', 'http://localhost/helmet');
      expect(links[0]).toHaveAttribute('rel', 'canonical');
      expect(links[1]).toHaveAttribute('href', 'http://localhost/style.css');
      expect(links[1]).toHaveAttribute('rel', 'stylesheet');
    });

    it('clears link tags when children are removed', () => {
      render(
        <Helmet>
          <link rel="canonical" href="http://localhost/helmet" />
        </Helmet>
      );

      expect(getMountElement().querySelectorAll('link').length).toBe(1);

      render(<Helmet />);

      expect(getMountElement().querySelectorAll('link').length).toBe(0);
    });
  });
});
