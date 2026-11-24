import React, { Suspense, act } from 'react';

import { Helmet } from '../src';

import { render } from './utils';

Helmet.defaultProps.defer = false;

// A resource that suspends until resolve() is called, like a lazy component or a data cache.
const createResource = () => {
  let done = false;
  let resolve!: () => void;
  const promise = new Promise<void>((_resolve) => {
    resolve = () => {
      done = true;
      _resolve();
    };
  });

  const Suspender = () => {
    if (!done) {
      throw promise;
    }
    return null;
  };

  return {
    Suspender,
    resolve: () =>
      act(async () => {
        resolve();
        await promise;
      }),
  };
};

describe('Suspense', () => {
  it('ignores a Helmet whose render is thrown away when a sibling suspends', async () => {
    const { Suspender, resolve } = createResource();

    const App = ({ showPage }: { showPage: boolean }) => (
      <>
        <Helmet>
          <title>Layout</title>
        </Helmet>
        {showPage && (
          <Suspense fallback={null}>
            <Helmet>
              <title>Page</title>
            </Helmet>
            <Suspender />
          </Suspense>
        )}
      </>
    );

    render(<App showPage />);

    // The page's Helmet rendered, but the boundary shows its fallback, so it isn't mounted.
    expect(document.title).toBe('Layout');

    await resolve();

    expect(document.title).toBe('Page');

    render(<App showPage={false} />);

    expect(document.title).toBe('Layout');
  });

  it('restores the tags of a Helmet when its boundary shows it again', async () => {
    const first = createResource();
    const second = createResource();
    await first.resolve();

    const Page = ({ Suspender }: { Suspender: () => null }) => (
      <Suspense fallback={null}>
        <Helmet>
          <title>Page</title>
          <meta name="description" content="Page description" />
        </Helmet>
        <Suspender />
      </Suspense>
    );

    render(
      <>
        <Helmet>
          <title>Layout</title>
        </Helmet>
        <Page Suspender={first.Suspender} />
      </>
    );

    expect(document.title).toBe('Page');

    // The boundary hides its content to show the fallback again.
    render(
      <>
        <Helmet>
          <title>Layout</title>
        </Helmet>
        <Page Suspender={second.Suspender} />
      </>
    );

    expect(document.title).toBe('Layout');
    expect(document.head.querySelector('meta[name="description"]')).toBeNull();

    await second.resolve();

    expect(document.title).toBe('Page');
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Page description'
    );
  });
});
