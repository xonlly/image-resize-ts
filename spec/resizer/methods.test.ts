const resizer = require('../../src/index');

describe('image-resizer', () => {
  it('should be get an resizer object', () => {
    console.log('resizer', resizer.default);

    expect(true).toBe(true);
  });
});
