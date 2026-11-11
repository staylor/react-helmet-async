export const REPO_URL = 'https://github.com/staylor/react-helmet-async';

const VERSION = /^(\d+)\.(\d+)\.(\d+)$/;
const HEADING = /^## /;
const LINK_DEFINITION = /^\[[^\]]+\]: /;

export type Bump = 'major' | 'minor' | 'patch';

// The version after `current`: a bump keyword or an explicit x.y.z that is newer.
// Prereleases aren't supported; they would need their own npm dist-tag.
export function nextVersion(current: string, bump: Bump | string): string {
  const parts = VERSION.exec(current);
  if (!parts) {
    throw new Error(`package.json version ${current} is not x.y.z.`);
  }
  const [major, minor, patch] = parts.slice(1).map(Number);

  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  if (bump === 'patch') return `${major}.${minor}.${patch + 1}`;

  const explicit = VERSION.exec(bump);
  if (!explicit) {
    throw new Error(`Expected major, minor, patch or a version like 1.2.3, got "${bump}".`);
  }
  const [newMajor, newMinor, newPatch] = explicit.slice(1).map(Number);
  // The first part that differs decides the order.
  if ((newMajor - major || newMinor - minor || newPatch - patch) <= 0) {
    throw new Error(`${bump} is not newer than ${current}.`);
  }
  return bump;
}

// Moves the entries under `## [Unreleased]` into a `## [version] - date` section, and
// points the [Unreleased] link at the new tag with a link for the new version.
export function releaseChangelog(changelog: string, version: string, date: string): string {
  const lines = changelog.split('\n');
  const start = lines.indexOf('## [Unreleased]');
  if (start === -1) {
    throw new Error('CHANGELOG.md has no "## [Unreleased]" heading.');
  }
  if (lines.some((line) => line.startsWith(`## [${version}]`))) {
    throw new Error(`CHANGELOG.md already has a section for ${version}.`);
  }

  let end = lines.findIndex((line, i) => i > start && HEADING.test(line));
  if (end === -1) end = lines.length;
  const entries = lines
    .slice(start + 1, end)
    .join('\n')
    .trim();
  if (!entries) {
    throw new Error(
      'The [Unreleased] section of CHANGELOG.md is empty; there is nothing to release.'
    );
  }

  const link = lines.findIndex((line) => line.startsWith('[Unreleased]: '));
  const base = link === -1 ? null : /\/compare\/(.+)\.\.\.HEAD$/.exec(lines[link]);
  if (!base) {
    throw new Error(
      'CHANGELOG.md needs an "[Unreleased]: <repo>/compare/<previous>...HEAD" link to update.'
    );
  }

  const released = [
    ...lines.slice(0, start + 1),
    '',
    `## [${version}] - ${date}`,
    '',
    entries,
    '',
    ...lines.slice(end),
  ];
  const linkIndex = released.findIndex((line) => line.startsWith('[Unreleased]: '));
  released.splice(
    linkIndex,
    1,
    `[Unreleased]: ${REPO_URL}/compare/v${version}...HEAD`,
    `[${version}]: ${REPO_URL}/compare/${base[1]}...v${version}`
  );
  return released.join('\n');
}

// The body of a version's section, for a GitHub release or pull request, followed by
// its compare link when the changelog has one.
export function releaseNotes(changelog: string, version: string): string {
  const lines = changelog.split('\n');
  const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
  if (start === -1) {
    throw new Error(`CHANGELOG.md has no section for ${version}.`);
  }

  let end = lines.findIndex(
    (line, i) => i > start && (HEADING.test(line) || LINK_DEFINITION.test(line))
  );
  if (end === -1) end = lines.length;
  const body = lines
    .slice(start + 1, end)
    .join('\n')
    .trim();

  const link = lines.find((line) => line.startsWith(`[${version}]: `));
  return link
    ? `${body}\n\n**Full changes:** ${link.slice(`[${version}]: `.length)}\n`
    : `${body}\n`;
}
