import { useCallback, useEffect, useMemo } from 'react';

import { GetUserInfoStatus } from '@app';
import { useAppNavigation } from '@hooks';
import { LogError, checkAndNavigateToWizard } from '@utils';

import { WizardState } from '..';

export const useInitializationCheck = (
  state: WizardState,
  loadInitialData: () => Promise<void>,
) => {
  const { navigate, isWizard } = useAppNavigation();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (state.ui.initialLoading) return;

    const checkWizardState = async () => {
      try {
        await checkAndNavigateToWizard(navigate, isWizard);
      } catch (err) {
        LogError(`Failed to check wizard state: ${err}`);
        if (!isWizard) {
          try {
            navigate('/wizard');
          } catch (navError) {
            LogError(`Failed to check wizard state: ${navError}`);
            window.location.href = '/wizard';
          }
        }
      }
    };

    checkWizardState();
    const interval = setInterval(checkWizardState, 1500);
    return () => clearInterval(interval);
  }, [state.ui.initialLoading, isWizard, navigate, state.api]);

  const verifyCompletionStep = useCallback(async () => {
    if (state.ui.activeStep === 2 && !state.ui.initialLoading) {
      try {
        const wizardState = await GetUserInfoStatus();
        if (wizardState.missingNameEmail) {
          return 0;
        } else if (wizardState.rpcUnavailable) {
          return 1;
        }
        return 2;
      } catch (error) {
        LogError(`Failed to verify completion step: ${error}`);
        return state.ui.activeStep;
      }
    }
    return state.ui.activeStep;
  }, [state.ui.activeStep, state.ui.initialLoading]);

  return useMemo(
    () => ({
      verifyCompletionStep,
    }),
    [verifyCompletionStep],
  );
};
