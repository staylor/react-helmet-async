import 'raf/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactDOM from 'react-dom';

configure({ adapter: new Adapter() });

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body><div id="mount"></div></body></html>', {
  url: 'https://nytimes.com',
});
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }),
      {}
    );
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

const mount = document.getElementById('mount');

beforeEach(() => {
  document.head.innerHTML = '';
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(mount);
});
