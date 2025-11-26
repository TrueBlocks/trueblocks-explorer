// Address format constants for consistent messaging across the application

export const ADDRESS_VALIDATION_ERROR =
  'Not a valid address. Must start with 0x and be 42 characters, or be an ENS name ending in .eth';

export const ADDRESS_PLACEHOLDER = '0x1234...5678 or vitalik.eth';

export const ADDRESS_HELP_TEXT =
  'Must be a valid address starting with 0x and 42 characters, or an ENS name ending in .eth';

export const ADDRESS_DESCRIPTION = 'Enter one or more addresses or ENS names';

// Centralized validation function for address/ENS form inputs
export const validateAddressOrEns = (value: string): string | null => {
  if (!value) return 'Address is required';

  if (value.endsWith('.eth')) {
    if (value.length < 5) return 'ENS name too short';
    if (!/^[a-z0-9-]+\.eth$/i.test(value)) return 'Invalid ENS name format';
    return null;
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    return ADDRESS_VALIDATION_ERROR;
  }

  return null;
};
