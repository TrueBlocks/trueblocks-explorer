import { DetailPanelContainer } from '@components';
import { Code, ScrollArea } from '@mantine/core';
import { types } from '@models';

export const OpenApprovalsPanel = (rowData: Record<string, unknown> | null) => {
  if (!rowData) return null;
  const approval = rowData as unknown as types.Transaction;
  return (
    <DetailPanelContainer>
      <ScrollArea h={400}>
        <Code block>{JSON.stringify(approval, null, 2)}</Code>
      </ScrollArea>
    </DetailPanelContainer>
  );
};
