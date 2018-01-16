module.exports = config => {
  config.set({
    basePath: './',
    preprocessors: {
      'spec/**/*.ts': ['karma-typescript'],
    },
    reporters: ['progress', 'karma-typescript'],
    frameworks: ['jasmine', 'karma-typescript'],
    browsers: ['Chrome'],
    files: ['spec/**/*.ts'],
  });
};
