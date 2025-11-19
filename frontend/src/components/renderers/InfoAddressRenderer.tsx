import { createAddressLink } from '@utils';

import { BorderedSection, PanelRow, PanelTable } from '.';

export interface AddressInfo {
  from?: unknown;
  fromName?: string;
  to?: unknown;
  toName?: string;
  showFromLabel?: boolean;
  toLabel?: string; // Custom label for 'to' field (e.g., 'Contract' for logs)
}

interface InfoAddressProps {
  addressInfo: AddressInfo;
}

export const InfoAddressRenderer = ({ addressInfo }: InfoAddressProps) => {
  const { from, fromName, to, toName, showFromLabel, toLabel } = addressInfo;

  return (
    <BorderedSection>
      <PanelTable>
        {showFromLabel && !!from && (
          <PanelRow
            label="From"
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
    </BorderedSection>
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
