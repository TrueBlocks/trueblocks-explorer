import { useEffect, useState } from 'react';

import { GetElementsConfig } from '@app';
import { preferences } from '@models';
import { LogError } from '@utils';

export interface UseElementsReturn {
  hideAddressSelector: boolean;
  hideChainSelector: boolean;
  hideContractSelector: boolean;
  hidePeriodSelector: boolean;
  hideProjectSelector: boolean;
  loading: boolean;
}

export const useElements = (): UseElementsReturn => {
  const [config, setConfig] = useState<preferences.ElementsConfig>({
    hideAddressSelector: false,
    hideChainSelector: false,
    hideContractSelector: false,
    hidePeriodSelector: false,
    hideProjectSelector: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const elementsConfig = await GetElementsConfig();
        setConfig(elementsConfig);
      } catch (error) {
        LogError('Failed to load elements configuration:', String(error));
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return {
    hideAddressSelector: config.hideAddressSelector ?? false,
    hideChainSelector: config.hideChainSelector ?? false,
    hideContractSelector: config.hideContractSelector ?? false,
    hidePeriodSelector: config.hidePeriodSelector ?? false,
    hideProjectSelector: config.hideProjectSelector ?? false,
    loading,
  };
};
