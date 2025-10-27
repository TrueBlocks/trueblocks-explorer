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

// Single payload function - backend decides what data to use for collection sharing
export const usePayload = () => {
  const { activeAddress, activeChain, activePeriod } = useActiveProject();
  return useCallback(
    (dataFacet: types.DataFacet, targetAddress?: string) => {
      validatePayloadAddress(
        activeAddress,
        `usePayload - dataFacet: ${dataFacet}, activeAddress: ${activeAddress}`,
      );

      // Validate targetAddress if provided
      if (targetAddress) {
        validatePayloadAddress(
          targetAddress,
          `usePayload - dataFacet: ${dataFacet}, targetAddress: ${targetAddress}`,
        );
      }

      return types.Payload.createFrom({
        dataFacet,
        activeChain: activeChain,
        activeAddress: activeAddress,
        activePeriod: activePeriod,
        targetAddress: targetAddress || '', // Send specific target address when provided
      });
    },
    [activeChain, activeAddress, activePeriod],
  );
};
