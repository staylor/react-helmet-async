import React from 'react';
import { createRoot } from 'react-dom/client';

import { HelmetProvider } from '../../src';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
