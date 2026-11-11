// Opens a release pull request: pnpm release <major|minor|patch|x.y.z> [--dry-run]
// Merging it runs .github/workflows/publish.yml, which publishes to npm and creates the
// GitHub release. --dry-run prints the version and notes without touching git.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

import { nextVersion, releaseChangelog, releaseNotes } from './release-helpers';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const run = (command: string, args: string[]) =>
  execFileSync(command, args, { encoding: 'utf8' }).trim();

interface Release {
  current: string;
  version: string;
  // CHANGELOG.md and package.json as they should be committed
  changelog: string;
  packageJson: string;
  notes: string;
}

function prepare(bump: string): Release {
  const packageJson = readFileSync('package.json', 'utf8');
  const current: string = JSON.parse(packageJson).version;
  const version = nextVersion(current, bump);
  const date = new Date().toISOString().slice(0, 10);
  const changelog = releaseChangelog(readFileSync('CHANGELOG.md', 'utf8'), version, date);

  const bumped = packageJson.replace(`"version": "${current}"`, `"version": "${version}"`);
  if (bumped === packageJson) {
    throw new Error(`Couldn't find "version": "${current}" in package.json.`);
  }
  return {
    current,
    version,
    changelog,
    packageJson: bumped,
    notes: releaseNotes(changelog, version),
  };
}

const dryRun = process.argv.includes('--dry-run');
const bump = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!bump) {
  fail('Usage: pnpm release <major|minor|patch|x.y.z> [--dry-run]');
}

let release: Release;
try {
  release = prepare(bump);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
const { current, version, changelog, packageJson, notes } = release;

console.log(`${current} -> ${version}\n\n${notes}`);
if (dryRun) {
  process.exit(0);
}

if (run('git', ['branch', '--show-current']) !== 'main') {
  fail('Start a release from main.');
}
if (run('git', ['status', '--porcelain'])) {
  fail('Commit or stash your changes first.');
}
run('git', ['fetch', '--quiet', 'origin', 'main']);
if (run('git', ['rev-parse', 'HEAD']) !== run('git', ['rev-parse', 'origin/main'])) {
  fail('main differs from origin/main; pull or push first.');
}

const branch = `release/v${version}`;
const title = `chore(release): v${version}`;
run('git', ['switch', '--create', branch]);
writeFileSync('CHANGELOG.md', changelog);
writeFileSync('package.json', packageJson);
run('pnpm', ['exec', 'oxfmt', 'CHANGELOG.md', 'package.json']);
run('git', ['commit', '--all', '--message', title]);
run('git', ['push', '--set-upstream', 'origin', branch]);

const body = `Merging this publishes react-helmet-async@${version} to npm and creates the v${version} GitHub release with these notes.\n\n${notes}`;
const url = run('gh', [
  'pr',
  'create',
  '--base',
  'main',
  '--head',
  branch,
  '--title',
  title,
  '--body',
  body,
]);
run('git', ['switch', 'main']);

console.log(`Opened ${url}`);
