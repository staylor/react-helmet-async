import React from 'react';
import type { MockedFunction } from 'vitest';

import { Helmet } from '../src';

import { render } from './utils';
import './window';

declare global {
  interface Window {
    __spy__: MockedFunction<any>;
  }
}

describe.skip('deferred tags', () => {
  beforeEach(() => {
    Object.defineProperty(window, '__spy__', {
      configurable: true,
      value: vi.fn(() => {}),
    });
  });

  afterEach(() => {
    // @ts-ignore
    delete window.__spy__;
  });

  describe('API', () => {
    it('executes synchronously when defer={true} and async otherwise', async () => {
      render(
        <div>
          <Helmet
            defer={false}
            script={[
              {
                innerHTML: `window.__spy__(1)`,
              },
            ]}
          />
          <Helmet
            script={[
              {
                innerHTML: `window.__spy__(2)`,
              },
            ]}
          />
        </div>
      );

      expect(window.__spy__).toHaveBeenCalledTimes(1);

      await vi.waitFor(
        () =>
          new Promise(resolve => {
            requestAnimationFrame(() => {
              // @ts-ignore
              expect(window.__spy__).toHaveBeenCalledTimes(2);
              // @ts-ignore
              expect(window.__spy__.mock.calls).toStrictEqual([[1], [2]]);

              resolve(true);
            });
          })
      );
    });
  });

  describe('Declarative API', () => {
    it('executes synchronously when defer={true} and async otherwise', async () => {
      render(
        <div>
          <Helmet defer={false}>
            <script>window.__spy__(1)</script>
          </Helmet>
          <Helmet>
            <script>window.__spy__(2)</script>
          </Helmet>
        </div>
      );

      expect(window.__spy__).toHaveBeenCalledTimes(1);

      await vi.waitFor(
        () =>
          new Promise(resolve => {
            requestAnimationFrame(() => {
              expect(window.__spy__).toHaveBeenCalledTimes(2);
              expect(window.__spy__.mock.calls).toStrictEqual([[1], [2]]);

              resolve(true);
            });
          })
      );
    });
  });
});
