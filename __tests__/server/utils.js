import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import Provider from '../../src/Provider';

// eslint-disable-next-line
export const render = (node, context = {}) => {
  const mount = document.getElementById('mount');

  ReactDOM.render(
    <StrictMode>
      <Provider context={context}>{node}</Provider>
    </StrictMode>,
    mount
  );
};
