import type { ReactNode } from 'react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import Provider from '../src/Provider';

let root: Root | null = null;

export const unmount = () => {
  act(() => {
    root?.unmount();
    root = null;
  });
};

export const render = (node: ReactNode, context = {} as any) => {
  if (!root) {
    const elem = document.getElementById('mount') as HTMLElement;
    root = createRoot(elem);
  }

  act(() => {
    root?.render(
      <StrictMode>
        <Provider context={context}>{node}</Provider>
      </StrictMode>
    );
  });
};

export const renderContext = (node: ReactNode) => {
  const context = {} as any;
  render(node, context);
  return context.helmet;
};

export const isArray = {
  asymmetricMatch: (actual: any) => Array.isArray(actual),
};
