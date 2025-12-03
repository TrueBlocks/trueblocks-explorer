import { StyledLabel, StyledValue } from '@components';
import { createAddressLink } from '@utils';

import { PanelRow, PanelTable } from '.';

export interface AddressInfo {
  from?: unknown;
  fromName?: string;
  fromLabel?: string;
  showFromLabel?: boolean;
  to?: unknown;
  toName?: string;
  toLabel?: string;
  extra?: unknown;
  extraName?: string;
  extraLabel?: string;
}

interface InfoAddressProps {
  addressInfo: AddressInfo;
}

export const InfoAddressRenderer = ({ addressInfo }: InfoAddressProps) => {
  const {
    from,
    fromName,
    fromLabel,
    showFromLabel,
    to,
    toName,
    toLabel,
    extra,
    extraName,
    extraLabel,
  } = addressInfo;

  return (
    <PanelTable>
      {showFromLabel && !!from && (
        <PanelRow
          label={
            <StyledLabel variant="blue">{fromLabel || 'From'}</StyledLabel>
          }
          value={
            <>
              {fromName && (
                <>
                  <StyledValue weight="normal">{fromName}</StyledValue>
                  <br />
                </>
              )}
              <StyledValue variant="blue" size="xs">
                {createAddressLink(from)}
              </StyledValue>
            </>
          }
        />
      )}
      {!!extra && (
        <PanelRow
          label={
            <StyledLabel variant="blue">{extraLabel || 'Extra'}</StyledLabel>
          }
          value={
            <>
              {extraName && (
                <>
                  <StyledValue weight="normal">{extraName}</StyledValue>
                  <br />
                </>
              )}
              <StyledValue variant="blue" size="xs">
                {createAddressLink(extra)}
              </StyledValue>
            </>
          }
        />
      )}
      {!!to && (
        <PanelRow
          label={<StyledLabel variant="blue">{toLabel || 'To'}</StyledLabel>}
          value={
            <>
              {toName && (
                <>
                  <StyledValue weight="normal">{toName}</StyledValue>
                  <br />
                </>
              )}
              <StyledValue variant="blue" size="xs">
                {createAddressLink(to)}
              </StyledValue>
            </>
          }
        />
      )}
    </PanelTable>
  );
};

export const txToAddressInfo = (
  from?: unknown,
  fromName?: string,
  to?: unknown,
  toName?: string,
): AddressInfo => {
  return {
    from,
    fromName,
    to,
    toName,
    showFromLabel: true,
    toLabel: 'To',
  };
};

export const approvalToAddressInfo = (
  from?: unknown,
  fromName?: string,
  to?: unknown,
  toName?: string,
  extra?: unknown,
  extraName?: string,
): AddressInfo => {
  return {
    from,
    fromName,
    fromLabel: 'Owner',
    showFromLabel: true,
    to,
    toName,
    toLabel: 'Spender',
    extra,
    extraName,
    extraLabel: 'Token',
  };
};

export const logToAddressInfo = (
  contractAddress?: unknown,
  contractName?: string,
): AddressInfo => {
  return {
    from: undefined,
    fromName: undefined,
    to: contractAddress,
    toName: contractName,
    showFromLabel: false,
    toLabel: 'Contract',
  };
};
