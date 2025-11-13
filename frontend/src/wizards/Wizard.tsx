import { FormEvent, useEffect, useState } from 'react';

import { GetAppId, GetWizardReturn } from '@app';
import { Card, Container, Stepper, Text } from '@mantine/core';
import { checkAndNavigateToWizard } from '@utils';
import { useLocation } from 'wouter';

import { StepChainInfo, StepCompleted, StepUserInfo } from '.';
import {
  useWizardNavigation,
  useWizardState,
  useWizardValidation,
} from './hooks';

export const Wizard = () => {
  const [appName, setAppName] = useState('Your App');
  const [location, navigate] = useLocation();
  const isWizard = location.startsWith('/wizard');

  useEffect(() => {
    GetAppId().then((id) => {
      setAppName(id.appName);
    });
  }, []);

  const {
    state,
    updateData,
    updateValidation,
    updateUI,
    submitUserInfo,
    submitChainInfo,
    completeWizard,
  } = useWizardState();

  const { goToPreviousStep } = useWizardNavigation(state, updateUI);

  const { validateName, validateEmail, validateRpc, validateUserInfo } =
    useWizardValidation(state, updateValidation);

  useEffect(() => {
    const checkCompletionStep = async () => {
      if (state.ui.activeStep === 2) {
        const correctStep =
          (await checkAndNavigateToWizard(navigate, isWizard)) ??
          state.ui.activeStep;
        if (correctStep !== state.ui.activeStep) {
          updateUI({ activeStep: correctStep });
        }
      }
    };

    checkCompletionStep();
  }, [state.ui.activeStep, navigate, updateUI, isWizard]);

  const handleUserInfoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateUserInfo()) {
      return;
    }
    await submitUserInfo();
  };

  const handleChainSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRpc()) {
      return;
    }
    await submitChainInfo();
  };

  const handleClose = async () => {
    await completeWizard();
    const ret = await GetWizardReturn();
    navigate(ret || '/projects'); // DEFAULT_ROUTE
  };

  const handleCompletionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleClose();
  };

  const welcomeText = `Welcome to ${appName}`;

  return (
    <Container mt="xl">
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Text variant="primary" size="md" fw={600}>
          {state.data.isFirstTimeSetup
            ? welcomeText
            : state.ui.activeStep === 2
              ? 'All Issues Resolved'
              : 'Something is Wrong'}
        </Text>
        <Text variant="dimmed" size="md">
          {state.data.isFirstTimeSetup
            ? 'Complete the following steps to get started'
            : state.ui.activeStep === 2
              ? 'Your application is now ready to use again.'
              : "Let's fix the issue to get you back on track"}
        </Text>

        <Stepper active={state.ui.activeStep}>
          <Stepper.Step
            label="User Information"
            description="Setup your profile"
          >
            <StepUserInfo
              state={state}
              onSubmit={handleUserInfoSubmit}
              updateData={updateData}
              validateName={validateName}
              validateEmail={validateEmail}
              onCancel={handleClose}
            />
          </Stepper.Step>

          <Stepper.Step
            label="Chain Configuration"
            description="Connect to Ethereum"
          >
            <StepChainInfo
              state={state}
              onSubmit={handleChainSubmit}
              onBack={goToPreviousStep}
              updateData={updateData}
              updateValidation={updateValidation}
              validateRpc={validateRpc}
              onCancel={handleClose}
            />
          </Stepper.Step>

          <Stepper.Step label="Complete" description="Ready to start">
            <StepCompleted
              state={state}
              onSubmit={handleCompletionSubmit}
              onBack={goToPreviousStep}
              onCancel={handleClose}
            />
          </Stepper.Step>
        </Stepper>
      </Card>
    </Container>
  );
};
