import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – base tag', () => {
  describe('API', () => {
    it('renders a base tag', () => {
      render(<Helmet base={{ href: 'http://mysite.com/' }} />);

      const base = getMountElement().querySelector('base');
      expect(base).not.toBeNull();
      expect(base).toHaveAttribute('href', 'http://mysite.com/');
    });

    it('renders base tag with target', () => {
      render(<Helmet base={{ href: 'http://mysite.com/', target: '_blank' }} />);

      const base = getMountElement().querySelector('base');
      expect(base).toHaveAttribute('href', 'http://mysite.com/');
      expect(base).toHaveAttribute('target', '_blank');
    });

    it('does not render a base tag when none specified', () => {
      render(<Helmet />);

      const base = getMountElement().querySelector('base');
      expect(base).toBeNull();
    });

    it('updates base tag on re-render', () => {
      render(<Helmet base={{ href: 'http://first.com/' }} />);

      let base = getMountElement().querySelector('base');
      expect(base).toHaveAttribute('href', 'http://first.com/');

      render(<Helmet base={{ href: 'http://second.com/' }} />);

      base = getMountElement().querySelector('base');
      expect(base).toHaveAttribute('href', 'http://second.com/');
    });
  });

  describe('Declarative API', () => {
    it('renders a base tag from children', () => {
      render(
        <Helmet>
          <base href="http://mysite.com/" />
        </Helmet>
      );

      const base = getMountElement().querySelector('base');
      expect(base).not.toBeNull();
      expect(base).toHaveAttribute('href', 'http://mysite.com/');
    });
  });
});
