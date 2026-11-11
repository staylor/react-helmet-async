import React from 'react';
import type { MockedFunction } from 'vitest';

import { Helmet } from '../src';

import { render } from './utils';

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
          new Promise((resolve) => {
            requestAnimationFrame(() => {
              expect(window.__spy__).toHaveBeenCalledTimes(2);
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
          new Promise((resolve) => {
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

describe('deferred tags in a hidden tab', () => {
  // Browsers pause animation frames while a tab is hidden. Frames queued here only run when a
  // test calls runPausedFrames(), as they would once the tab is shown again.
  const frames = new Map<number, FrameRequestCallback>();
  let lastFrame = 0;

  const runPausedFrames = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(performance.now()));
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      lastFrame += 1;
      frames.set(lastFrame, callback);
      return lastFrame;
    });
    vi.stubGlobal('cancelAnimationFrame', (frame: number) => frames.delete(frame));
  });

  afterEach(() => {
    frames.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('updates the title while animation frames are paused', () => {
    render(<Helmet defer title="Inbox (1)" />);
    vi.advanceTimersByTime(100);

    expect(document.title).toBe('Inbox (1)');
  });

  it('applies only the latest state, once, even after paused frames run', () => {
    const onChangeClientState = vi.fn();

    render(<Helmet defer onChangeClientState={onChangeClientState} title="Inbox (1)" />);
    render(<Helmet defer onChangeClientState={onChangeClientState} title="Inbox (2)" />);
    vi.advanceTimersByTime(100);
    runPausedFrames();

    expect(document.title).toBe('Inbox (2)');
    expect(onChangeClientState).toHaveBeenCalledTimes(1);
  });

  it('keeps applying changes while updates arrive faster than the fallback timeout', () => {
    // An update every 50 ms. Each commit is due 100 ms after the first update it includes, and
    // applies the latest one.
    for (let count = 2; count <= 10; count += 2) {
      render(<Helmet defer title={`Inbox (${count - 1})`} />);
      vi.advanceTimersByTime(50);
      render(<Helmet defer title={`Inbox (${count})`} />);
      vi.advanceTimersByTime(50);

      expect(document.title).toBe(`Inbox (${count})`);
    }
  });
});
