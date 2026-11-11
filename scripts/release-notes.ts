// Prints a version's notes from CHANGELOG.md: pnpm --silent release-notes <version>
import { readFileSync } from 'node:fs';

import { releaseNotes } from './release-helpers';

const version = process.argv[2]?.replace(/^v/, '');
if (!version) {
  console.error('Usage: pnpm --silent release-notes <version>');
  process.exit(1);
}

try {
  process.stdout.write(releaseNotes(readFileSync('CHANGELOG.md', 'utf8'), version));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
