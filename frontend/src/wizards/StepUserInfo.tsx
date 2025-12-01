import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';

import { GetUserPreferences } from '@app';
import { FormField, WizardForm } from '@components';
import { emitStatus } from '@utils';
import { LogError } from 'wailsjs/runtime/runtime';

import { WizardStepProps } from '.';
import { WizardStateData } from './WizardTypes';

export const StepUserInfo = ({
  state,
  onSubmit,
  updateData,
  validateName,
  validateEmail,
  onCancel,
}: WizardStepProps) => {
  const { name, email } = state.data;
  const { nameError, emailError } = state.validation;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userPrefs = await GetUserPreferences();
        if (updateData) {
          updateData({
            name: userPrefs.name || '',
            email: userPrefs.email || '',
          });
        }
      } catch (error) {
        LogError(`Error trying to load user info: ${error}`);
        emitStatus(`Error trying to load user info: ${error}`);
      }
    };

    if (!name && !email) {
      loadUserData();
    }
  }, [name, email, updateData]);

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (updateData) {
        updateData({ name: newValue });
      }
    },
    [updateData],
  );

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (updateData) {
        updateData({ email: newValue });
      }
    },
    [updateData],
  );

  const formFields: FormField<WizardStateData>[] = useMemo(
    () => [
      {
        name: 'name',
        value: name,
        label: 'Name',
        placeholder: 'Enter your name',
        required: true,
        error: nameError,
        onChange: handleNameChange,
        onBlur: validateName,
      },
      {
        name: 'email',
        value: email,
        label: 'Email',
        placeholder: 'Enter your email',
        required: true,
        error: emailError,
        onChange: handleEmailChange,
        onBlur: validateEmail,
      },
    ],
    [
      name,
      email,
      nameError,
      emailError,
      handleNameChange,
      handleEmailChange,
      validateName,
      validateEmail,
    ],
  );

  return (
    <WizardForm<WizardStateData>
      title="User Information"
      description="Please provide your name and email address."
      fields={formFields}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};
