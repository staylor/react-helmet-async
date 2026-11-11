import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup-test-env.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'react-18',
          exclude: ['node_modules', 'lib', 'e2e', '__tests__/react19-real'],
        },
      },
      {
        // Runs __tests__/react19-real on React 19 itself through the react-19 and react-dom-19
        // aliases, so React hoists Helmet's tags. The __tests__/react19 suites run on React 18
        // and only mock isReact19.
        extends: true,
        resolve: {
          alias: {
            react: 'react-19',
            'react-dom': 'react-dom-19',
          },
        },
        test: {
          name: 'react-19',
          include: ['__tests__/react19-real/**/*.test.tsx'],
        },
      },
    ],
  },
});
