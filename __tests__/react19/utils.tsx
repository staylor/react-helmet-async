import type { ReactNode } from 'react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import Provider from '../../src/Provider';

let root: Root | null = null;

export const unmount = () => {
  act(() => {
    root?.unmount();
    root = null;
  });
};

/**
 * Render helper for React 19 tests.
 *
 * In the React 19 code path, HelmetProvider is a transparent passthrough and
 * React19Dispatcher renders real elements into the component tree. Since we
 * are actually running on React 18 in tests (with isReact19 mocked to true),
 * those elements appear inside #mount rather than being hoisted to <head>.
 */
export const render = (node: ReactNode) => {
  if (!root) {
    const elem = document.getElementById('mount') as HTMLElement;
    root = createRoot(elem);
  }

  act(() => {
    root?.render(
      <StrictMode>
        <Provider>{node}</Provider>
      </StrictMode>
    );
  });
};

/**
 * Query rendered elements inside #mount (where React 19 dispatcher renders
 * them, since actual React 19 <head> hoisting doesn't happen in React 18).
 */
export const getMountElement = () => document.getElementById('mount') as HTMLElement;
