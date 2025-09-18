import {
  addressToHex,
  getDisplayAddress,
  hexToAddress,
  isValidAddress,
} from '../addresses';

describe('addressToHex', () => {
  it('returns hex for string input', () => {
    expect(addressToHex('0x1234')).toBe('0x1234');
  });
  it('returns hex for base.Address object', () => {
    const addr = { address: [1, 2, 3, 4] };
    expect(addressToHex(addr)).toBe('0x01020304');
  });
  it('returns empty string for invalid input', () => {
    expect(addressToHex(null)).toBe('');
  });
});

describe('getDisplayAddress', () => {
  it('truncates long address', () => {
    expect(
      getDisplayAddress('0x1234567890abcdef1234567890abcdef12345678'),
    ).toBe('0x1234...5678');
  });
  it('returns short address as is', () => {
    expect(getDisplayAddress('0x1234')).toBe('0x1234');
  });
});

describe('isValidAddress', () => {
  it('returns true for valid address', () => {
    expect(isValidAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(
      true,
    );
  });
  it('returns false for zero address', () => {
    expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(
      false,
    );
  });
  it('returns false for invalid address', () => {
    expect(isValidAddress('0x1234')).toBe(false);
  });
});

describe('hexToAddress', () => {
  it('converts hex string to base.Address', () => {
    const addr = hexToAddress('0x01020304');
    expect(addr.address).toEqual([1, 2, 3, 4]);
  });
});
