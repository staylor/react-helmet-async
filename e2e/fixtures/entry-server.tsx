import React from 'react';
import { renderToString } from 'react-dom/server';

import { HelmetProvider } from '../../src';
import type { HelmetServerState } from '../../src';

import { App } from './App';
import type { Page } from './App';

export function renderPage(page: Page) {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <App page={page} />
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  return { html, helmet };
}
