import React from 'react';
import { Helmet } from '../src';
import { render } from './utils';

describe('deferred tags', () => {
  let root = window as any;
  beforeEach(() => {
    root.__spy__ = vi.fn();
  });

  afterEach(() => {
    delete root.__spy__;
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

      expect(root.__spy__).toHaveBeenCalledTimes(1);

      await vi.waitFor(
        () =>
          new Promise(resolve => {
            requestAnimationFrame(() => {
              // expect(root.__spy__).toHaveBeenCalledTimes(2);
              expect(root.__spy__.mock.calls).toStrictEqual([[1], [2]]);

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

      expect(root.__spy__).toHaveBeenCalledTimes(1);

      await vi.waitFor(
        () =>
          new Promise(resolve => {
            requestAnimationFrame(() => {
              // expect(root.__spy__).toHaveBeenCalledTimes(2);
              expect(root.__spy__.mock.calls).toStrictEqual([[1], [2]]);

              resolve(true);
            });
          })
      );
    });
  });
});
