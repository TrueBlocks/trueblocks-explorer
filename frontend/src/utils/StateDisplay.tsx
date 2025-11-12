import { CSSProperties } from 'react';

import { StyledText } from '@components';
import { Badge, Flex } from '@mantine/core';
import { types } from '@models';

interface StateDisplayProps {
  state: types.StoreState;
  facetName: string;
  totalItems?: number;
  style?: CSSProperties;
}

const getStateColor = (state: types.StoreState) => {
  switch (state) {
    case types.StoreState.STALE:
      return 'gray';
    case types.StoreState.FETCHING:
      return 'blue';
    case types.StoreState.LOADED:
      return 'green';
    default:
      return 'gray';
  }
};

const getStateLabel = (state: types.StoreState) => {
  switch (state) {
    case types.StoreState.STALE:
      return 'Stale';
    case types.StoreState.FETCHING:
      return 'Fetching...';
    case types.StoreState.LOADED:
      return 'Loaded';
    default:
      return 'Unknown' + String(state);
  }
};

export const StateDisplay = ({
  state,
  facetName,
  totalItems,
  style,
}: StateDisplayProps) => {
  return (
    <Flex
      gap="sm"
      align="center"
      style={{
        padding: '8px 16px',
        borderBottom: '1px solid #e0e0e0',
        ...style,
      }}
    >
      <StyledText size="sm" variant="dimmed">
        Facet: <strong>{facetName}</strong>
      </StyledText>
      <Badge color={getStateColor(state)} variant="light" size="sm">
        {getStateLabel(state)}
      </Badge>
      {totalItems !== undefined && (
        <StyledText size="sm" variant="dimmed">
          Items: <strong>{totalItems}</strong>
        </StyledText>
      )}
    </Flex>
  );
};
