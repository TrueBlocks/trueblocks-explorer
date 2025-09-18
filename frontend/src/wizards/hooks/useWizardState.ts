import { useCallback, useEffect, useMemo, useState } from 'react';

import { IsInitialized, SetChain, SetInitialized, SetUserInfo } from '@app';
import { preferences } from '@models';
import { LogError } from '@utils';

import { WizardState, WizardValidationErrors } from '../WizardTypes';

export const useWizardState = () => {
  const initialState: WizardState = {
    data: {
      name: '',
      email: '',
      rpcUrl: '',
      chainName: '',
      chainId: '',
      symbol: '',
      remoteExplorer: '',
      isFirstTimeSetup: true,
    },
    validation: {
      nameError: '',
      emailError: '',
      rpcError: '',
      chainError: '',
    },
    ui: {
      activeStep: 0,
      initialLoading: true,
      loading: false,
    },
    api: {
      initialized: false,
      missingNameEmail: true,
      rpcUnavailable: true,
    },
  };

  const [state, setState] = useState<WizardState>(initialState);

  const updateData = useCallback((data: Partial<WizardState['data']>) => {
    setState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        ...data,
      },
    }));
  }, []);

  const updateValidation = useCallback(
    (validation: Partial<WizardValidationErrors>) => {
      setState((prevState) => ({
        ...prevState,
        validation: {
          ...prevState.validation,
          ...validation,
        },
      }));
    },
    [],
  );

  const updateUI = useCallback((ui: Partial<WizardState['ui']>) => {
    setState((prevState) => ({
      ...prevState,
      ui: {
        ...prevState.ui,
        ...ui,
      },
    }));
  }, []);

  const updateAPI = useCallback((api: Partial<WizardState['api']>) => {
    setState((prevState) => ({
      ...prevState,
      api: {
        ...prevState.api,
        ...api,
      },
    }));
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const initialized = await IsInitialized();
      const firstTimeSetup = !initialized;
      updateData({ isFirstTimeSetup: firstTimeSetup });
      updateAPI({ initialized });
    } catch (error) {
      LogError(
        'Error checking initialization status: ' + JSON.stringify(error),
      );
    } finally {
      updateUI({ initialLoading: false });
    }
  }, [updateData, updateAPI, updateUI]);

  const submitUserInfo = useCallback(async () => {
    updateUI({ loading: true });

    try {
      await SetUserInfo(state.data.name, state.data.email);
      updateUI({ activeStep: 1, loading: false });
    } catch (error) {
      updateUI({ loading: false });
      throw error;
    }
  }, [state.data.name, state.data.email, updateUI]);

  const submitChainInfo = useCallback(async () => {
    updateUI({ loading: true });

    try {
      var chain = preferences.Chain.createFrom({
        name: state.data.chainName,
        id: state.data.chainId,
        symbol: state.data.symbol,
        remoteExplorer: state.data.remoteExplorer,
        rpcProviders: [state.data.rpcUrl],
      });
      await SetChain(chain);
      updateUI({ activeStep: 2, loading: false });
    } catch (error) {
      updateValidation({ rpcError: String(error) });
      updateUI({ loading: false });
    }
  }, [
    state.data.chainName,
    state.data.chainId,
    state.data.symbol,
    state.data.remoteExplorer,
    state.data.rpcUrl,
    updateUI,
    updateValidation,
  ]);

  const completeWizard = useCallback(async () => {
    updateUI({ loading: true });

    try {
      await SetInitialized(true);
      updateUI({ loading: false });
    } catch (error) {
      updateUI({ loading: false });
      throw error;
    }
  }, [updateUI]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return useMemo(
    () => ({
      state,
      updateData,
      updateValidation,
      updateUI,
      updateAPI,
      loadInitialData,
      submitUserInfo,
      submitChainInfo,
      completeWizard,
    }),
    [
      state,
      updateData,
      updateValidation,
      updateUI,
      updateAPI,
      loadInitialData,
      submitUserInfo,
      submitChainInfo,
      completeWizard,
    ],
  );
};
