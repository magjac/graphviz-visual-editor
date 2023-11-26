const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '8wm34o',
  defaultCommandTimeout: 10000,
  video: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    excludeSpecPattern: '*~',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
