import { createAddressLink } from '@utils';

import { CustomSection, PanelRow, PanelTable } from '.';

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
    <CustomSection>
      <PanelTable>
        {showFromLabel && !!from && (
          <PanelRow
            label={fromLabel || 'From'}
            value={
              <>
                {fromName && (
                  <div className="panel-nested-name">{fromName}</div>
                )}
                <div className="panel-nested-address">
                  {createAddressLink(from)}
                </div>
              </>
            }
          />
        )}
        {!!extra && (
          <PanelRow
            label={extraLabel || 'Extra'}
            value={
              <>
                {extraName && (
                  <div className="panel-nested-name">{extraName}</div>
                )}
                <div className="panel-nested-address">
                  {createAddressLink(extra)}
                </div>
              </>
            }
          />
        )}
        {!!to && (
          <PanelRow
            label={toLabel || 'To'}
            value={
              <>
                {toName && <div className="panel-nested-name">{toName}</div>}
                <div className="panel-nested-address">
                  {createAddressLink(to)}
                </div>
              </>
            }
          />
        )}
      </PanelTable>
    </CustomSection>
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
