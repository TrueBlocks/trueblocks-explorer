import { useCallback } from 'react';

import { types } from '@models';

import { useActiveProject } from './useActiveProject';

function validatePayloadAddress(address: string, context: string) {
  if (address === '' || address === '0x0') {
    return;
  }

  const isValidEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!isValidEthereumAddress) {
    const error = `INVALID ETHEREUM ADDRESS FORMAT! Address '${address}' in context: ${context}. Must be 0x followed by 40 hex characters.`;
    throw new Error(error);
  }
}

// TODO: BOGUS - THIS SHOULD INCLUDE ACTIVE CONTRACT
export const usePayload = () => {
  const { activeAddress, activeChain, activePeriod } = useActiveProject();
  return useCallback(
    (dataFacet: types.DataFacet, address?: string) => {
      const finalAddress = address || activeAddress;
      validatePayloadAddress(
        finalAddress,
        `usePayload - dataFacet: ${dataFacet}, provided address: ${address}, activeAddress: ${activeAddress}`,
      );

      return types.Payload.createFrom({
        dataFacet,
        chain: activeChain,
        address: finalAddress,
        period: activePeriod,
      });
    },
    [activeChain, activeAddress, activePeriod],
  );
};
