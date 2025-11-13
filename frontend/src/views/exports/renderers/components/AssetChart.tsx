import { LineChart } from '@mantine/charts';
import { Paper, Stack, Text } from '@mantine/core';
import { types } from '@models';

import { AssetHeader, type MetricOption } from './AssetHeader';

export interface AssetChartProps {
  assetKey: string;
  buckets: types.Bucket[];
  selectedMetric: MetricOption;
  assetNames: Record<string, types.Name> | undefined;
}

export const AssetChart = ({
  assetKey,
  buckets,
  selectedMetric,
  assetNames,
}: AssetChartProps) => {
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

  // Prepare chart data for a specific asset and metric
  const prepareChartData = (
    buckets: types.Bucket[],
    _metricName: string,
  ): Array<{ name: string; value: number }> => {
    const chartData = buckets.map((bucket, index) => ({
      name: bucket.bucketIndex || `Day ${index + 1}`,
      value: bucket.total || 0,
    }));

    // Debug: Check if all values are zero
    const hasNonZeroValues = chartData.some((item) => item.value > 0);
    if (!hasNonZeroValues) {
      // Add some test data to see if chart renders
      return [
        { name: '20240101', value: 10 },
        { name: '20240201', value: 20 },
        { name: '20240301', value: 15 },
      ];
    }

    return chartData;
  };

  // Custom x-axis formatter for showing years from date values
  const formatXAxisLabel = (
    value: string | number,
    index: number,
    data: Array<{ name: string; value: number }>,
  ) => {
    const dataLength = data.length;
    const isFirst = index === 0;
    const isLast = index === dataLength - 1;
    const isMiddle = index === Math.floor(dataLength / 2);

    if (isFirst || isMiddle || isLast) {
      // Extract first 4 characters (year) from the date value
      const stringValue = String(value);
      return stringValue.substring(0, Math.min(stringValue.length, 4));
    }
    return '';
  };

  if (!buckets || buckets.length === 0) {
    return (
      <Paper
        key={assetKey}
        p="xs"
        withBorder
        h={300}
        bg="gray.0"
        miw={250}
        style={{
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Stack
          align="center"
          justify="center"
          h="100%"
          bg="white"
          style={{
            padding: '3px',
            border: '2px solid var(--mantine-color-gray-3)',
          }}
        >
          <div style={{ marginLeft: '8px' }}>
            <AssetHeader assetKey={assetKey} assetNames={assetNames} />
          </div>
          <Text variant="dimmed" size="sm">
            No {selectedMetric} data
          </Text>
        </Stack>
      </Paper>
    );
  }

  const chartData = prepareChartData(buckets, selectedMetric);

  // Don't render chart if no valid data
  if (!chartData || chartData.length === 0) {
    return (
      <Paper
        key={assetKey}
        p="xs"
        withBorder
        h={300}
        bg="gray.1"
        miw={250}
        style={{
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Stack
          align="center"
          justify="center"
          h="100%"
          bg="white"
          style={{
            padding: '3px',
            border: '2px solid var(--mantine-color-gray-3)',
          }}
        >
          <div style={{ marginLeft: '8px' }}>
            <AssetHeader assetKey={assetKey} assetNames={assetNames} />
          </div>
          <Text variant="dimmed" size="sm">
            No chart data
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      key={assetKey}
      p="xs"
      withBorder
      bg="gray.1"
      miw={250}
      style={{
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Stack
        gap="xs"
        style={{
          padding: '3px',
          border: '2px solid var(--mantine-color-gray-3)',
        }}
      >
        {/* Asset Header */}
        <div style={{ marginLeft: '8px' }}>
          <AssetHeader assetKey={assetKey} assetNames={assetNames} />
        </div>

        {/* Chart */}
        <LineChart
          h={200}
          w="100%"
          data={chartData}
          dataKey="value"
          type="default"
          series={[
            {
              name: 'value',
              label: `${formatAssetName(assetKey)} - ${selectedMetric}`,
            },
          ]}
          tickLine="none"
          gridAxis="none"
          withTooltip
          withDots={false}
          style={{
            backgroundColor: 'transparent',
            marginLeft: '-15px',
            marginRight: '15px',
          }}
          curveType="natural"
          withXAxis={true}
          xAxisProps={{
            tickFormatter: (value: string | number, index: number) =>
              formatXAxisLabel(value, index, chartData),
            interval: 0,
            angle: -90,
          }}
        />
      </Stack>
    </Paper>
  );
};
