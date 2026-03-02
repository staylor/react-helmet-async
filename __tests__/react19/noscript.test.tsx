import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – noscript tags', () => {
  describe('API', () => {
    it('renders noscript tags with innerHTML', () => {
      render(
        <Helmet
          noscript={[
            {
              id: 'bar',
              innerHTML: '<link rel="stylesheet" type="text/css" href="foo.css" />',
            },
          ]}
        />
      );

      const noscripts = getMountElement().querySelectorAll('noscript');
      expect(noscripts.length).toBe(1);
      expect(noscripts[0]).toHaveAttribute('id', 'bar');
      expect(noscripts[0].innerHTML).toBe(
        '<link rel="stylesheet" type="text/css" href="foo.css" />'
      );
    });

    it('renders no noscript tags when none are specified', () => {
      render(<Helmet />);

      const noscripts = getMountElement().querySelectorAll('noscript');
      expect(noscripts.length).toBe(0);
    });
  });

  describe('Declarative API', () => {
    it('renders noscript tags from children', () => {
      render(
        <Helmet>
          <noscript id="bar">{`<link rel="stylesheet" type="text/css" href="foo.css" />`}</noscript>
        </Helmet>
      );

      const noscript = getMountElement().querySelector('noscript');
      expect(noscript).not.toBeNull();
      expect(noscript).toHaveAttribute('id', 'bar');
      expect(noscript!.innerHTML).toBe('<link rel="stylesheet" type="text/css" href="foo.css" />');
    });
  });
});
