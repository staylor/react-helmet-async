import { build } from 'esbuild';

import { dependencies, peerDependencies } from './package.json';

const shared = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
};

build({
  ...shared,
  format: 'cjs',
  outfile: 'lib/index.js',
});

build({
  ...shared,
  outfile: 'lib/index.mjs',
  format: 'esm',
});
