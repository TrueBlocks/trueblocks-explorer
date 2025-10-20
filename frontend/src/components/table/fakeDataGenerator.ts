// Simple fake data generator for placeholder rows
export const generateFakeData = (columnType: string, index: number): string => {
  const fakeAddresses = [
    '0xPlaceholderAddress1',
    '0xPlaceholderAddress2',
    '0xPlaceholderAddress3',
    '0xPlaceholderAddress4',
    '0xPlaceholderAddress5',
    '0xPlaceholderAddress6',
  ];

  const fakeHashes = [
    '0xPlaceholderHash1',
    '0xPlaceholderHash2',
    '0xPlaceholderHash3',
    '0xPlaceholderHash4',
    '0xPlaceholderHash5',
    '0xPlaceholderHash6',
  ];

  const fakeNumbers = ['1,234', '5,678', '9,012', '3,456', '7,890', '2,468'];
  const fakeDates = [
    '2024-10-15 14:30:45',
    '2024-10-14 09:15:22',
    '2024-10-13 16:42:18',
    '2024-10-12 11:28:36',
    '2024-10-11 20:55:41',
    '2024-10-10 08:17:29',
  ];
  const fakeWei = [
    '0.0123456789 ETH',
    '1.2345678901 ETH',
    '0.9876543210 ETH',
    '2.3456789012 ETH',
    '0.5678901234 ETH',
    '1.8765432109 ETH',
  ];

  const safeIndex = index % 6;

  switch (columnType?.toLowerCase()) {
    case 'address':
      return fakeAddresses[safeIndex] || 'Loading address...';
    case 'hash':
      return fakeHashes[safeIndex] || 'Loading hash...';
    case 'datetime':
      return fakeDates[safeIndex] || 'Loading date...';
    case 'wei':
      return fakeWei[safeIndex] || 'Loading wei...';
    case 'number':
    case 'float':
      return fakeNumbers[safeIndex] || 'Loading number...';
    default:
      return `Sample ${columnType || 'data'} ${index + 1}`;
  }
};
