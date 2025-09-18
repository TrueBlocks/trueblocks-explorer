import { useEffect, useRef } from 'react';

import { WizardForm } from '@components';

import { WizardStepProps } from '.';

export const StepCompleted = ({
  state,
  onSubmit,
  onBack,
  onCancel,
}: WizardStepProps) => {
  const { isFirstTimeSetup } = state.data;

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  }, []);

  return (
    <WizardForm
      title={isFirstTimeSetup ? 'Setup Complete' : 'All Issues Resolved'}
      description={
        isFirstTimeSetup
          ? 'Congratulations! You have successfully configured the app. You can now start using the application.'
          : 'Great news! All configuration issues have been resolved. Your application is now ready to use again.'
      }
      fields={[]}
      submitText="Get Started"
      submitButtonRef={submitButtonRef}
      onBack={onBack}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};
