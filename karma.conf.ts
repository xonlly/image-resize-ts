module.exports = config => {
  config.set({
    files: [{ pattern: 'src/**/*.spec.ts' }],
    frameworks: ['jasmine', 'karma-typescript'],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
    },
    reporters: ['dots', 'karma-typescript'],
    browsers: ['Chrome'],
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
    },
  });
};
