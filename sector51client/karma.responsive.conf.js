// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false },
      "./src/styles.css",
      "./node_modules/font-awesome/css/font-awesome.css",
      {
        pattern: './node_modules/font-awesome/fonts/*',
        watched: false,
        included: false,
        served: true,
        nocache: false
      },
      "./node_modules/bootstrap/dist/css/bootstrap.min.css"
    ],
    exclude: [
      '**/*.responsive.spec.ts'
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'coverage-istanbul']
              : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'chrome540', 'chrome576', 'chrome768', 'chrome992', 'chrome1200' ],
    singleRun: false,
    customLaunchers: {
      chrome540: {
        base: 'Chrome',
        flags: [ '--window-size=540,960' ]
      },
      chrome576: {
        base: 'Chrome',
        flags: [ '--window-size=576,750' ]
      },
      chrome768: {
        base: 'Chrome',
        flags: [ '--window-size=768,750' ]
      },
      chrome992: {
        base: 'Chrome',
        flags: [ '--window-size=992,750' ]
      },
      chrome1200: {
        base: 'Chrome',
        flags: [ '--window-size=1200,750' ]
      }
    }
  });
};
