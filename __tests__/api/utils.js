import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import Provider from '../../src/Provider';

// eslint-disable-next-line
export const render = node => {
  const mount = document.getElementById('mount');

  ReactDOM.render(
    <StrictMode>
      <Provider>{node}</Provider>
    </StrictMode>,
    mount
  );
};
