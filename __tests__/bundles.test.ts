// @vitest-environment node
import { parse } from 'acorn';
import { build } from 'esbuild';

import { bundles } from '../build.config';

// webpack 4.0–4.11 parse with ecmaVersion 2018. Keep it in step with `target` in build.config.ts.
describe('bundles', () => {
  it.each(bundles)('$outfile parses as ES2018', async (options) => {
    const { outputFiles } = await build({ ...options, write: false });

    expect(() =>
      parse(outputFiles[0].text, {
        ecmaVersion: 2018,
        sourceType: options.format === 'esm' ? 'module' : 'script',
      })
    ).not.toThrow();
  });
});
