const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '8wm34o',
  defaultCommandTimeout: 10000,
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    excludeSpecPattern: '*~',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
