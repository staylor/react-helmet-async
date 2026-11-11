import '@testing-library/jest-dom/vitest';
import { clearInstances } from '../src/HelmetData';

import { unmount } from './utils';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let headElement: HTMLHeadElement;

beforeEach(() => {
  headElement ||= document.head || document.querySelector('head');

  headElement.innerHTML = '';
  document.body.innerHTML = '<div id="mount"></div>';
});

afterEach(() => {
  unmount();

  clearInstances();
});
