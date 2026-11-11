import { REPO_URL, nextVersion, releaseChangelog, releaseNotes } from '../scripts/release-helpers';

const changelog = `# Changelog

Intro.

## [Unreleased]

### Fixed

- A fix.

## [3.0.0] - 2026-03-03

### Added

- React 19 support.

## 1.x and earlier

See the history.

[Unreleased]: ${REPO_URL}/compare/abc123...HEAD
[3.0.0]: ${REPO_URL}/compare/def456...abc123
`;

describe('release helpers', () => {
  describe('nextVersion', () => {
    it.each([
      ['patch', '3.0.1'],
      ['minor', '3.1.0'],
      ['major', '4.0.0'],
      ['3.2.0', '3.2.0'],
    ])('bumps 3.0.0 with %s to %s', (bump, expected) => {
      expect(nextVersion('3.0.0', bump)).toBe(expected);
    });

    it.each(['3.0.0', '2.9.9'])('rejects %s, which is not newer than 3.0.0', (bump) => {
      expect(() => nextVersion('3.0.0', bump)).toThrow('is not newer than 3.0.0');
    });

    it.each(['next', '3.1', '3.1.0-beta.1'])('rejects %s, which is not a version', (bump) => {
      expect(() => nextVersion('3.0.0', bump)).toThrow('Expected major, minor, patch');
    });
  });

  describe('releaseChangelog', () => {
    it('moves the unreleased entries under the new version and updates the links', () => {
      const released = releaseChangelog(changelog, '3.1.0', '2026-11-12');

      expect(released).toContain(
        '## [Unreleased]\n\n## [3.1.0] - 2026-11-12\n\n### Fixed\n\n- A fix.\n\n## [3.0.0] - 2026-03-03'
      );
      expect(released).toContain(
        `[Unreleased]: ${REPO_URL}/compare/v3.1.0...HEAD\n` +
          `[3.1.0]: ${REPO_URL}/compare/abc123...v3.1.0\n` +
          `[3.0.0]: ${REPO_URL}/compare/def456...abc123\n`
      );
    });

    it('refuses to release an empty unreleased section', () => {
      const released = releaseChangelog(changelog, '3.1.0', '2026-11-12');

      expect(() => releaseChangelog(released, '3.2.0', '2026-11-13')).toThrow(
        'there is nothing to release'
      );
    });

    it('refuses a version that already has a section', () => {
      expect(() => releaseChangelog(changelog, '3.0.0', '2026-11-12')).toThrow(
        'already has a section for 3.0.0'
      );
    });
  });

  describe('releaseNotes', () => {
    it("returns a version's entries and its compare link", () => {
      expect(releaseNotes(changelog, '3.0.0')).toBe(
        `### Added\n\n- React 19 support.\n\n**Full changes:** ${REPO_URL}/compare/def456...abc123\n`
      );
    });

    it('reads back the section that releaseChangelog writes', () => {
      const released = releaseChangelog(changelog, '3.1.0', '2026-11-12');

      expect(releaseNotes(released, '3.1.0')).toBe(
        `### Fixed\n\n- A fix.\n\n**Full changes:** ${REPO_URL}/compare/abc123...v3.1.0\n`
      );
    });

    it('throws for a version without a section', () => {
      expect(() => releaseNotes(changelog, '9.9.9')).toThrow('has no section for 9.9.9');
    });
  });
});
