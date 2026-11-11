import type { BuildOptions } from 'esbuild';

import { dependencies, peerDependencies } from './package.json';

const shared: BuildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
  // webpack 4 (Create React App 3–4) can't parse class fields, `?.` or `??` (#212).
  target: 'es2018',
};

export const bundles: BuildOptions[] = [
  { ...shared, format: 'cjs', outfile: 'lib/index.js' },
  { ...shared, format: 'esm', outfile: 'lib/index.esm.js' },
];
