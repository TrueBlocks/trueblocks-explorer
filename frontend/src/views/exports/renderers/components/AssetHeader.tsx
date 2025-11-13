import { useActiveProject } from '@hooks';
import {
  Badge,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { types } from '@models';

export type MetricOption = 'frequency' | 'volume' | 'endBal';

export interface AssetHeaderProps {
  assetKey?: string;
  assetNames?: Record<string, types.Name> | undefined;
  // New props for the enhanced header
  bucketsData?: types.Buckets | null;
  selectedMetric?: MetricOption;
  sortDirection?: 'asc' | 'desc';
  onMetricChange?: (metric: MetricOption) => void;
  onSortToggle?: () => void;
}

const formatAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const calculateGlobalStats = (bucketsData: types.Buckets | null) => {
  if (!bucketsData?.series) {
    return {
      dateRange: 'No data',
      totalAddresses: 0,
      totalStatements: 0,
    };
  }

  const { series } = bucketsData;

  // Calculate total addresses (unique asset keys)
  const uniqueAssets = new Set<string>();
  Object.keys(series).forEach((seriesName) => {
    const dotIndex = seriesName.lastIndexOf('.');
    if (dotIndex !== -1) {
      const assetKey = seriesName.substring(0, dotIndex);
      uniqueAssets.add(assetKey);
    }
  });

  // Calculate total statements from frequency metrics
  let totalStatements = 0;
  Object.entries(series).forEach(([seriesName, buckets]) => {
    if (seriesName.endsWith('.frequency')) {
      totalStatements += buckets.reduce((sum, bucket) => sum + bucket.total, 0);
    }
  });

  // Get date range from bucket keys (YYYYMMDD format)
  const allDates = new Set<string>();
  Object.values(series).forEach((buckets) => {
    buckets.forEach((bucket) => {
      // Extract date from bucketIndex which is in YYYYMMDD format
      if (bucket.bucketIndex && bucket.bucketIndex.length === 8) {
        allDates.add(bucket.bucketIndex);
      }
    });
  });

  let dateRange = 'No data';
  if (allDates.size > 0) {
    const sortedDates = Array.from(allDates).sort();
    const minDate = sortedDates[0];
    const maxDate = sortedDates[sortedDates.length - 1];

    // Format dates for display (YYYY-MM-DD)
    const formatDate = (dateStr: string) => {
      if (dateStr.length === 8) {
        return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
      }
      return dateStr;
    };

    if (minDate && maxDate) {
      if (minDate === maxDate) {
        dateRange = formatDate(minDate);
      } else {
        dateRange = `${formatDate(minDate)} to ${formatDate(maxDate)}`;
      }
    }
  }
  return {
    dateRange,
    totalAddresses: uniqueAssets.size,
    totalStatements,
  };
};

export const AssetHeader = ({
  assetKey,
  assetNames,
  bucketsData,
  selectedMetric,
  sortDirection,
  onMetricChange,
  onSortToggle,
}: AssetHeaderProps) => {
  const { activeAddress } = useActiveProject();

  // If this is being used for global header (no assetKey), show global info
  if (!assetKey) {
    const stats = calculateGlobalStats(bucketsData || null);

    return (
      <Stack gap="xs">
        {/* Main row with address and controls */}
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text variant="primary" size="md" fw={600}>
            Current Address: {formatAddress(activeAddress)}
          </Text>

          {/* Metrics and Sort Controls */}
          <Group gap="sm" align="center" wrap="nowrap">
            <Text variant="dimmed" size="sm">
              Metrics:
            </Text>
            {selectedMetric && onMetricChange && (
              <Select
                size="sm"
                value={selectedMetric}
                onChange={(value) => onMetricChange(value as MetricOption)}
                data={[
                  { value: 'frequency', label: 'Statement Frequency' },
                  { value: 'volume', label: 'Volume' },
                  { value: 'endBal', label: 'Ending Balance' },
                ]}
                style={{ minWidth: 150 }}
              />
            )}
            {sortDirection && onSortToggle && (
              <Button
                size="sm"
                variant="light"
                onClick={onSortToggle}
                style={{ height: '24px', padding: '0 8px' }}
              >
                {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
              </Button>
            )}
          </Group>
        </Group>

        {/* Statistics badges row */}
        <Group gap="md" align="center">
          <Badge variant="light">Date Range: {stats.dateRange}</Badge>
          <Badge variant="light" color="blue">
            Addresses: {stats.totalAddresses.toLocaleString()}
          </Badge>
          <Badge variant="light" color="green">
            Statements: {stats.totalStatements.toLocaleString()}
          </Badge>
        </Group>
      </Stack>
    );
  }

  // Format asset name for display using backend asset names with fallback
  const formatAssetName = (assetKey: string): string => {
    // Check if we have an asset name from the backend data
    if (assetNames?.[assetKey]) {
      return assetNames[assetKey].name;
    }

    // Fallback to existing formatting logic
    // Parse the asset key: "0x1234567890ab_ETH" -> address + symbol
    const parts = assetKey.split('_');
    if (parts.length === 2) {
      const address = parts[0];
      const symbol = parts[1];

      // Ensure we have a valid address
      if (!address || address.length < 10) {
        return assetKey;
      }

      // If symbol is ETH, just show the shortened address
      if (symbol === 'ETH') {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      }

      // For other symbols, show both shortened address and symbol
      return `${address.slice(0, 6)}...${address.slice(-4)} (${symbol})`;
    }

    // Fallback: if no underscore, assume it's just an address
    if (assetKey.startsWith('0x') && assetKey.length > 10) {
      return `${assetKey.slice(0, 6)}...${assetKey.slice(-4)}`;
    }

    return assetKey;
  };

  // Original individual asset header
  return (
    <Group justify="space-between" align="center">
      <Title order={5} fw={600}>
        {formatAssetName(assetKey)}
      </Title>
    </Group>
  );
};
