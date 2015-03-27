(function () {
  'use strict';

  module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine'],
      preprocessors: {
        'src/**/*.js': ['coverage']
      },
      reporters: ['progress', 'coverage'],
      coverageReporter: {
        reporters:[
          {type: 'html', subdir: 'html'},
          {type: 'text-summary'}
        ],
        dir: 'test/coverage'
      },
      plugins : [
          'karma-phantomjs-launcher',
          'karma-jasmine',
          'karma-coverage'
      ],
      colors: true,
      browsers: ['PhantomJS']
    });
  };
})();
