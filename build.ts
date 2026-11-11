import { build } from 'esbuild';

import { bundles } from './build.config';

// esbuild prints its own errors; make a failed build fail the command too.
Promise.all(bundles.map((options) => build(options))).catch(() => {
  process.exitCode = 1;
});
