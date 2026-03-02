import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – style tags', () => {
  describe('API', () => {
    it('renders style tags with cssText', () => {
      const css1 = 'body { background-color: green; }';
      const css2 = 'p { font-size: 12px; }';
      render(<Helmet style={[{ type: 'text/css', cssText: css1 }, { cssText: css2 }]} />);

      const styles = getMountElement().querySelectorAll('style');
      expect(styles.length).toBe(2);

      expect(styles[0]).toHaveAttribute('type', 'text/css');
      expect(styles[0].innerHTML).toBe(css1);
      expect(styles[1].innerHTML).toBe(css2);
    });

    it('renders no style tags when none are specified', () => {
      render(<Helmet />);

      const styles = getMountElement().querySelectorAll('style');
      expect(styles.length).toBe(0);
    });

    it('updates style tags on re-render', () => {
      render(<Helmet style={[{ cssText: 'body { color: red; }' }]} />);

      let style = getMountElement().querySelector('style');
      expect(style!.innerHTML).toBe('body { color: red; }');

      render(<Helmet style={[{ cssText: 'body { color: blue; }' }]} />);

      style = getMountElement().querySelector('style');
      expect(style!.innerHTML).toBe('body { color: blue; }');
    });
  });

  describe('Declarative API', () => {
    it('renders style tags from children', () => {
      const css = 'body { color: green; }';
      render(
        <Helmet>
          <style type="text/css">{css}</style>
        </Helmet>
      );

      const style = getMountElement().querySelector('style');
      expect(style).not.toBeNull();
      expect(style).toHaveAttribute('type', 'text/css');
      expect(style!.innerHTML).toBe(css);
    });
  });
});
