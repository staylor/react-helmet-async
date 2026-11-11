import { createConfig } from '@wonderboymusic/oxc-config/oxlint';

export default createConfig({
  overrides: [
    {
      files: ['**/*.test.*'],
      rules: {
        // Suites are named after what they cover ("API", "React 19 – meta tags"), so only test titles are lowercased.
        'vitest/prefer-lowercase-title': ['warn', { ignore: ['describe'] }],
        // Snapshots are keyed by their order within a test; hints would only rename the existing keys.
        'vitest/prefer-snapshot-hint': 'off',
      },
    },
    {
      files: ['__tests__/**'],
      rules: {
        // The tests hand Helmet unknown attributes and a bare <html> on purpose.
        'jsx-a11y/html-has-lang': 'off',
        'react/no-unknown-property': 'off',
      },
    },
  ],
});
