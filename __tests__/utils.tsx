import type { ReactNode } from 'react';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import Provider from '../src/Provider';

export const render = (node: ReactNode, context = {} as any) => {
  ReactDOM.render(
    <StrictMode>
      <Provider context={context}>{node}</Provider>
    </StrictMode>,
    document.getElementById('mount')
  );
};

export const renderContext = (node: ReactNode) => {
  const context = {} as any;
  render(node, context);
  return context.helmet;
};

export const isArray = {
  asymmetricMatch: (actual: any) => Array.isArray(actual),
};
