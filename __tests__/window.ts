import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body><div id="mount"></div></body></html>', {
  url: 'https://nytimes.com',
});
const { window } = jsdom;

function copyProps(src: any, target: any) {
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

global.window = window as any;
global.document = window.document;

copyProps(window, global);
