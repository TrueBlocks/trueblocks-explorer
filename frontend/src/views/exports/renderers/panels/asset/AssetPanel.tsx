import { DetailPanelContainer } from '@components';
import { Code, ScrollArea } from '@mantine/core';
import { types } from '@models';

export const renderAssetDetailPanel = (
  rowData: Record<string, unknown> | null,
) => {
  if (!rowData) return null;

  const asset = rowData as unknown as types.Statement;

  return (
    <DetailPanelContainer>
      <ScrollArea h={400}>
        <Code block>{JSON.stringify(asset, null, 2)}</Code>
      </ScrollArea>
    </DetailPanelContainer>
  );
};
