import { useCallback, useMemo } from 'react';

import { WizardState, WizardUIState } from '..';

export const useWizardNavigation = (
  state: WizardState,
  updateUI: (ui: Partial<WizardUIState>) => void,
) => {
  const { activeStep } = state.ui;

  const goToPreviousStep = useCallback(() => {
    if (activeStep > 0) {
      updateUI({ activeStep: activeStep - 1 });
    }
  }, [activeStep, updateUI]);

  return useMemo(
    () => ({
      goToPreviousStep,
    }),
    [goToPreviousStep],
  );
};
