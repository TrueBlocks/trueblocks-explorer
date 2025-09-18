import { useCallback, useMemo } from 'react';

import { WizardState, WizardValidationErrors } from '../WizardTypes';

export const useWizardValidation = (
  state: WizardState,
  updateValidation: (validation: Partial<WizardValidationErrors>) => void,
) => {
  const validateName = useCallback(() => {
    if (!state.data.name) {
      updateValidation({ nameError: 'Name is required' });
      return false;
    }
    updateValidation({ nameError: '' });
    return true;
  }, [state.data.name, updateValidation]);

  const validateEmail = useCallback(() => {
    if (!state.data.email) {
      updateValidation({ emailError: 'Email is required' });
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(state.data.email)) {
      updateValidation({ emailError: 'Invalid email format' });
      return false;
    }

    updateValidation({ emailError: '' });
    return true;
  }, [state.data.email, updateValidation]);

  const validateRpc = useCallback(() => {
    let isValid = true;

    if (!state.data.rpcUrl) {
      updateValidation({ rpcError: 'RPC URL is required' });
      isValid = false;
    } else if (
      !state.data.rpcUrl.startsWith('http://') &&
      !state.data.rpcUrl.startsWith('https://')
    ) {
      updateValidation({
        rpcError: 'RPC URL must start with http:// or https://',
      });
      isValid = false;
    } else {
      updateValidation({ rpcError: '' });
    }

    if (!state.data.chainName) {
      updateValidation({ chainError: 'Chain name is required' });
      isValid = false;
    } else if (!state.data.chainId) {
      updateValidation({ chainError: 'Chain ID is required' });
      isValid = false;
    } else if (isNaN(parseInt(state.data.chainId, 10))) {
      updateValidation({ chainError: 'Chain ID must be a number' });
      isValid = false;
    } else if (!state.data.symbol) {
      updateValidation({ chainError: 'Symbol is required' });
      isValid = false;
    } else if (!state.data.remoteExplorer) {
      updateValidation({ chainError: 'Block explorer URL is required' });
      isValid = false;
    } else {
      updateValidation({ chainError: '' });
    }

    return isValid;
  }, [
    state.data.rpcUrl,
    state.data.chainName,
    state.data.chainId,
    state.data.symbol,
    state.data.remoteExplorer,
    updateValidation,
  ]);

  const validateUserInfo = useCallback(() => {
    const nameValid = validateName();
    const emailValid = validateEmail();
    return nameValid && emailValid;
  }, [validateName, validateEmail]);

  return useMemo(
    () => ({
      validateName,
      validateEmail,
      validateRpc,
      validateUserInfo,
    }),
    [validateName, validateEmail, validateRpc, validateUserInfo],
  );
};
