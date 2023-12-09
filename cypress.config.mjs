import { defineConfig } from 'cypress';
import configCodeCoverage from '@cypress/code-coverage/task.js'

export default defineConfig({
  projectId: '8wm34o',
  defaultCommandTimeout: 10000,
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      configCodeCoverage(on, config);

      return config;
    },
    excludeSpecPattern: '*~',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
