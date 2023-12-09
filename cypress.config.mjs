import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '8wm34o',
  defaultCommandTimeout: 10000,
  video: true,
  e2e: {
    excludeSpecPattern: '*~',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
