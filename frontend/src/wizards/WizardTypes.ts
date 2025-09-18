import { FormEvent } from 'react';

export interface WizardStateData {
  name: string;
  email: string;
  rpcUrl: string;
  chainName: string;
  chainId: string;
  symbol: string;
  remoteExplorer: string;
  isFirstTimeSetup: boolean;
  [key: string]: unknown;
}

export interface WizardValidationErrors {
  nameError: string;
  emailError: string;
  rpcError: string;
  chainError: string;
}

export interface WizardAPIState {
  initialized: boolean;
  missingNameEmail: boolean;
  rpcUnavailable: boolean;
}

export interface WizardUIState {
  activeStep: number;
  loading: boolean;
  initialLoading: boolean;
}

export type WizardStepKey = 'userInfo' | 'chain' | 'completed';

export interface WizardState {
  data: WizardStateData;
  validation: WizardValidationErrors;
  ui: WizardUIState;
  api: WizardAPIState;
}

export interface WizardStepProps {
  state: WizardState;
  onSubmit: (e: FormEvent) => void;
  onBack?: () => void;
  onCancel?: () => void;
  onNext?: () => void;
  onValidate?: () => boolean;
  updateData?: (data: {
    name?: string;
    email?: string;
    rpcUrl?: string;
    chainName?: string;
    chainId?: string;
    symbol?: string;
    remoteExplorer?: string;
  }) => void;
  updateValidation?: (validation: {
    rpcError?: string;
    chainError?: string;
  }) => void;
  validateEmail?: () => boolean;
  validateName?: () => boolean;
  validateRpc?: () => boolean;
  loading?: boolean;
}
