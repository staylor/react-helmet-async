import '@testing-library/jest-dom';
import ReactDOM from 'react-dom';
import { clearInstances } from '../src/HelmetData';

let headElement: HTMLHeadElement;

beforeEach(() => {
  headElement ||= document.head || document.querySelector('head');

  headElement.innerHTML = '';
  document.body.innerHTML = '<div id="mount"></div>';
});

afterEach(() => {
  const mount = document.getElementById('mount');
  if (mount) {
    ReactDOM.unmountComponentAtNode(mount);
  }

  clearInstances();
});
