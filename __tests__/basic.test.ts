/**
 * Simple API Test
 * Basic test to verify Jest setup works
 */

describe('Basic API Test', () => {
  it('should perform basic functionality tests', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test string operations', () => {
    expect('hello').toContain('ell');
    expect('world'.toUpperCase()).toBe('WORLD');
  });

  it('should test async operations', async () => {
    const promise = Promise.resolve('success');
    await expect(promise).resolves.toBe('success');
  });
});