import { base } from '@models';

// Convert any address-like input to hex string (equivalent to Go's addr.Hex())
export const addressToHex = (address: unknown): string => {
  if (typeof address === 'string') {
    return address;
  }

  // Handle base.Address objects (which have address: number[])
  if (address && typeof address === 'object' && 'address' in address) {
    const addrObj = address as base.Address;
    if (Array.isArray(addrObj.address)) {
      return (
        '0x' +
        addrObj.address
          .map((b: number) => b.toString(16).padStart(2, '0'))
          .join('')
      );
    }
  }

  // Legacy handling for objects with address property as string/array
  if (address && typeof address === 'object' && 'address' in address) {
    const legacyObj = address as { address?: string[] | string };
    if (Array.isArray(legacyObj.address)) {
      return legacyObj.address.join('');
    }
    if (typeof legacyObj.address === 'string') {
      return legacyObj.address;
    }
  }

  return '';
};

// Display address with truncation (first 6 + last 4 chars)
export const getDisplayAddress = (address: unknown): string => {
  const fullAddress = addressToHex(address);
  if (fullAddress.length > 10) {
    return `${fullAddress.slice(0, 6)}...${fullAddress.slice(-4)}`;
  }
  return fullAddress;
};

// Check if address is valid (non-zero)
export const isValidAddress = (address: unknown): boolean => {
  const addressStr = addressToHex(address);
  return (
    addressStr.length === 42 &&
    addressStr !== '0x0000000000000000000000000000000000000000'
  );
};

// Convert hex string to base.Address object (equivalent to Go's base.HexToAddress())
export const hexToAddress = (hexString: string): base.Address => {
  const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  const bytes: number[] = [];
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.substr(i, 2), 16));
  }

  return new base.Address({ address: bytes });
};
