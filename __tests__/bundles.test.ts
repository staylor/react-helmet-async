/// <reference types="vite/client" />
import { parse } from 'acorn';

import esm from '../lib/index.esm.js?raw';
import cjs from '../lib/index.js?raw';

// webpack 4.0–4.11 parse with ecmaVersion 2018. Keep it in step with `target` in build.ts.
describe('bundles', () => {
  it('lib/index.js parses as ES2018', () => {
    expect(() => parse(cjs, { ecmaVersion: 2018, sourceType: 'script' })).not.toThrow();
  });

  it('lib/index.esm.js parses as ES2018', () => {
    expect(() => parse(esm, { ecmaVersion: 2018, sourceType: 'module' })).not.toThrow();
  });
});
