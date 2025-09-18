import { useEffect } from 'react';

import { checkAndNavigateToWizard } from '@utils';

import { useAppNavigation } from './useAppNavigation';

export const useAppHealth = () => {
  const { ready, isWizard, navigate } = useAppNavigation();

  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      checkAndNavigateToWizard(navigate, isWizard);
    }, 1500);

    return () => clearInterval(interval);
  }, [ready, isWizard, navigate]);
};
