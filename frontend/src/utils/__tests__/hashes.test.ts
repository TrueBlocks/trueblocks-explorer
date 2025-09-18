import { displayHash } from '../hashes';

describe('displayHash', () => {
  it('returns short hash as is', () => {
    expect(displayHash('0x1234')).toBe('0x1234');
  });
  it('truncates long hash', () => {
    expect(displayHash('0x1234567890abcdef1234567890abcdef12345678')).toBe(
      '0x12345678…12345678',
    );
  });
  it('handles array hash', () => {
    expect(displayHash({ hash: [1, 2, 3, 4] })).toBe('0x01020304');
  });
  it('handles non-string input', () => {
    expect(displayHash(1234)).toBe('1234');
  });
  it('returns empty string for falsy', () => {
    expect(displayHash(null)).toBe('');
  });
});
