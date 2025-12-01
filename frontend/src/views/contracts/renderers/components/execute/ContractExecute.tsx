import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  StyledBadge,
  StyledButton,
  TransactionSuccessModal,
} from '@components';
import {
  Alert,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { types } from '@models';
import { LogError, addressToHex, emitError, emitStatus } from '@utils';
import { TxReviewModal } from '@wallet';
import {
  PreparedTransaction,
  TransactionData,
  buildTransaction,
  isArrayType,
  isStructType,
  useWalletConnection,
  useWalletGatedAction,
  validateSolidityValue,
  validateTransactionInputs,
} from '@wallet';

import { getWriteFunctions } from '../dashboard/facetCreation';

const ADDRESS_HELP_TEXT =
  'Must be a valid address starting with 0x and 42 characters, or an ENS name ending in .eth';

interface ContractExecuteProps {
  contractState: types.Contract;
  functionName: string;
  onTransaction?: (txData: TransactionData) => void;
}

interface FormFieldValue {
  value: string;
  error?: string;
}

interface FormState {
  [parameterName: string]: FormFieldValue;
}

// Convert a Parameter to appropriate form field type
const getFormFieldType = (
  parameter: types.Parameter,
): 'text' | 'number' | 'boolean' | 'textarea' | 'select' => {
  if (parameter.type === 'bool') {
    return 'boolean';
  }

  if (parameter.type.startsWith('uint') || parameter.type.startsWith('int')) {
    return 'number';
  }

  if (
    isArrayType(parameter.type) ||
    parameter.type === 'bytes' ||
    parameter.type === 'string'
  ) {
    return 'textarea';
  }

  if (isStructType(parameter)) {
    return 'textarea'; // For now, handle structs as JSON input
  }

  return 'text';
};

// Generate placeholder text for form fields
const getPlaceholder = (parameter: types.Parameter): string => {
  if (parameter.type === 'address') {
    return '0x1234567890123456789012345678901234567890';
  }

  if (parameter.type === 'bool') {
    return 'true or false';
  }

  if (parameter.type.startsWith('uint') || parameter.type.startsWith('int')) {
    return 'Enter a number';
  }

  if (parameter.type === 'string') {
    return 'Enter text';
  }

  if (parameter.type === 'bytes' || parameter.type.startsWith('bytes')) {
    return '0x...';
  }

  if (isArrayType(parameter.type)) {
    return 'Enter one value per line';
  }

  if (isStructType(parameter)) {
    return 'Enter JSON object: {"field1": "value1", "field2": "value2"}';
  }

  return `Enter ${parameter.type} value`;
};

// Generate help text for complex types
const getHelpText = (parameter: types.Parameter): string | undefined => {
  if (parameter.type === 'address') {
    return ADDRESS_HELP_TEXT;
  }

  if (isArrayType(parameter.type)) {
    return 'Enter one array element per line';
  }

  if (isStructType(parameter)) {
    const fields = {}; // parameter.components
    // ?.map((comp) => `"${comp.name}": "${comp.type}"`)
    // .join(', ');
    return `JSON object with fields: {${fields}}`;
  }

  if (parameter.type.startsWith('bytes') && parameter.type !== 'bytes') {
    const size = parameter.type.replace('bytes', '');
    return `Fixed-size bytes (${size} bytes = ${parseInt(size) * 2} hex characters)`;
  }

  return undefined;
};

export const ContractExecute: React.FC<ContractExecuteProps> = ({
  contractState,
  functionName,
  onTransaction,
}) => {
  const [formState, setFormState] = useState<FormState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [reviewModalOpened, setReviewModalOpened] = useState(false);
  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Wallet connection hook
  const { sendTransaction } = useWalletConnection({
    onTransactionSigned: (txHash) => {
      setTransactionHash(txHash);
      setReviewModalOpened(false);
      setSuccessModalOpened(true);
      emitStatus('Contract function executed successfully');
    },
    onError: (error) => {
      LogError(`Transaction failed: ${error}`);
      setTransactionHash(null);
      emitError('Transaction rejected by wallet');
    },
  });

  // Wallet gated action hook
  const { isWalletConnected, createWalletGatedAction } = useWalletGatedAction();

  // Track pending transaction submission
  const [pendingSubmission, setPendingSubmission] = useState(false);

  const writeFunctions = useMemo(
    () => (contractState.abi ? getWriteFunctions(contractState.abi) : []),
    [contractState.abi],
  );

  // Handle the "all" case by showing all write functions
  const showAllFunctions = functionName === 'all';

  const currentFunction: types.Function | undefined = showAllFunctions
    ? writeFunctions.find((func) => func.name === selectedFunction)
    : writeFunctions.find((func) => func.name === functionName);

  // Check if form is valid
  const isFormValid = useCallback((): boolean => {
    if (!currentFunction) return false;

    const requiredFields = currentFunction.inputs.filter(
      (input) => !input.name.startsWith('_'),
    );

    return requiredFields.every((input) => {
      const fieldState = formState[input.name];
      return fieldState && fieldState.value.trim() && !fieldState.error;
    });
  }, [currentFunction, formState]);

  // Execute transaction logic (extracted for reuse)
  const executeTransaction = useCallback(async () => {
    if (!currentFunction || !isFormValid()) {
      return;
    }

    setIsSubmitting(true);

    setTransactionHash(null);

    try {
      // Prepare transaction data
      const inputValues = currentFunction.inputs.map((input) => {
        const fieldState = formState[input.name];
        return {
          name: input.name,
          type: input.type,
          value: fieldState?.value || '',
        };
      });

      // Build transaction data
      const txData = buildTransaction(
        addressToHex(contractState.address),
        currentFunction,
        inputValues,
      );

      // Validate inputs
      const validation = validateTransactionInputs(
        currentFunction,
        inputValues,
      );
      if (!validation.isValid) {
        emitError(
          `Invalid function parameters: ${validation.errors.join(', ')}`,
        );
        return;
      }

      // Store transaction data and open review modal
      setTransactionData(txData);
      setReviewModalOpened(true);

      onTransaction?.(txData);
    } catch (error) {
      LogError(
        `Error preparing transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      emitError('Failed to prepare transaction');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentFunction,
    formState,
    contractState.address,
    onTransaction,
    isFormValid,
  ]);

  // Set default selected function if showing all
  useEffect(() => {
    if (showAllFunctions && writeFunctions.length > 0 && !selectedFunction) {
      setSelectedFunction(writeFunctions[0]?.name || '');
    }
    setLoading(false);
  }, [showAllFunctions, writeFunctions, selectedFunction]);

  // Auto-execute transaction when wallet connects after pending submission
  useEffect(() => {
    if (pendingSubmission && isWalletConnected) {
      setPendingSubmission(false);
      // Execute the transaction logic directly
      executeTransaction();
    }
  }, [pendingSubmission, isWalletConnected, executeTransaction]);

  // Compute if button should be disabled (only for form validation, not wallet state)
  const isButtonDisabled = useMemo(() => {
    return (
      currentFunction && currentFunction.inputs.length > 0 && !isFormValid()
    );
  }, [currentFunction, isFormValid]);

  // Show loading state while data is being processed
  if (loading) {
    return (
      <Stack gap="md" align="center" style={{ padding: '2rem' }}>
        <Loader size="lg" />
        <Text variant="dimmed" size="md">
          Loading write functions...
        </Text>
      </Stack>
    );
  }

  if (!contractState.abi) {
    return <Alert variant="light">No ABI available for this contract</Alert>;
  }

  if (writeFunctions.length === 0) {
    return (
      <Alert variant="light">No write functions found in this contract</Alert>
    );
  }

  if (!showAllFunctions && !currentFunction) {
    return (
      <Alert variant="light" bd="1px solid var(--mantine-color-error-6)">
        Function &quot;{functionName}&quot; not found in contract ABI
      </Alert>
    );
  }

  if (!currentFunction) {
    return <Alert variant="light">Please select a function</Alert>;
  }

  // Update form field value
  const updateFormField = (parameterName: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [parameterName]: {
        value,
        error: prev[parameterName]?.error,
      },
    }));
  };

  // Validate form field on blur
  const validateFormField = (parameterName: string, value: string) => {
    const parameter = currentFunction.inputs.find(
      (input) => input.name === parameterName,
    );
    if (!parameter) return;

    const validationError = validateSolidityValue(parameter.type, value);

    setFormState((prev) => ({
      ...prev,
      [parameterName]: {
        value,
        error: validationError || undefined,
      },
    }));
  };

  // Submit the transaction - now handles wallet gating with pending execution
  const handleSubmit = () => {
    if (!isWalletConnected) {
      // Set pending flag and trigger wallet connection
      setPendingSubmission(true);
      // Use the wallet gated action to trigger connection
      createWalletGatedAction(() => {}, 'Send Transaction')();
      return;
    }

    // Wallet is connected, execute immediately
    executeTransaction();
  };

  // Handle transaction confirmation from modal
  const handleConfirmTransaction = async (preparedTx: PreparedTransaction) => {
    try {
      await sendTransaction(preparedTx);
    } catch (error) {
      LogError(`Transaction failed: ${error}`);
      // Re-throw so modal can handle the error
      throw error;
    }
  };

  // Render form field based on parameter type
  const renderFormField = (parameter: types.Parameter) => {
    const fieldState = formState[parameter.name] || {
      value: '',
      error: undefined,
    };
    const fieldType = getFormFieldType(parameter);
    const placeholder = getPlaceholder(parameter);
    const helpText = getHelpText(parameter);

    const commonProps = {
      label: parameter.name,
      description: `${parameter.type}${helpText ? ` - ${helpText}` : ''}`,
      value: fieldState.value,
      error: fieldState.error,
      required: !parameter.name.startsWith('_'),
    };

    switch (fieldType) {
      case 'boolean':
        return (
          <Switch
            {...commonProps}
            checked={fieldState.value.toLowerCase() === 'true'}
            onChange={(event) =>
              updateFormField(
                parameter.name,
                event.currentTarget.checked ? 'true' : 'false',
              )
            }
          />
        );

      case 'number':
        return (
          <NumberInput
            {...commonProps}
            placeholder={placeholder}
            onChange={(value) =>
              updateFormField(parameter.name, value?.toString() || '')
            }
            onBlur={(event) =>
              validateFormField(parameter.name, event.currentTarget.value)
            }
            hideControls
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={placeholder}
            onChange={(event) =>
              updateFormField(parameter.name, event.currentTarget.value)
            }
            onBlur={(event) =>
              validateFormField(parameter.name, event.currentTarget.value)
            }
            minRows={3}
            autosize
          />
        );

      case 'select':
        // For enums or specific value sets (not implemented yet)
        return (
          <Select
            {...commonProps}
            placeholder={placeholder}
            data={[]} // TODO: Add enum values if available
            onChange={(value) => updateFormField(parameter.name, value || '')}
          />
        );

      default:
        return (
          <TextInput
            {...commonProps}
            placeholder={placeholder}
            onChange={(event) =>
              updateFormField(parameter.name, event.currentTarget.value)
            }
            onBlur={(event) =>
              validateFormField(parameter.name, event.currentTarget.value)
            }
          />
        );
    }
  };

  return (
    <Stack gap="md">
      {showAllFunctions && (
        <Select
          label="Select Function"
          placeholder="Choose a write function"
          value={selectedFunction}
          onChange={(value) => {
            setSelectedFunction(value || '');
            setFormState({}); // Reset form when function changes
          }}
          data={writeFunctions.map((func) => ({
            value: func.name,
            label: `${func.name} (${func.stateMutability})`,
          }))}
        />
      )}
      <div>
        <Group justify="space-between" align="center">
          <div>
            <Title order={4}>{currentFunction.name}</Title>
            <Group gap="xs">
              <StyledBadge variant="light">
                {currentFunction.stateMutability}
              </StyledBadge>
              {currentFunction.stateMutability === 'payable' && (
                <StyledBadge variant="filled">Requires ETH</StyledBadge>
              )}
            </Group>
          </div>
        </Group>

        {currentFunction.inputs.length === 0 && (
          <Text variant="dimmed" size="sm">
            This function takes no parameters
          </Text>
        )}
      </div>

      {currentFunction.inputs.length > 0 && (
        <Card withBorder>
          <Stack gap="md">
            <Text variant="primary" size="sm" fw={600}>
              Function Parameters
            </Text>
            <Divider />

            <Grid>
              {currentFunction.inputs.map((parameter, index) => (
                <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                  {renderFormField(parameter)}
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Card>
      )}

      <Group justify="flex-end">
        <StyledButton
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isButtonDisabled}
          variant="filled"
        >
          {!isWalletConnected
            ? 'Send Transaction'
            : currentFunction.stateMutability === 'payable'
              ? 'Send Transaction (with ETH)'
              : 'Send Transaction'}
        </StyledButton>
      </Group>

      <TransactionSuccessModal
        opened={successModalOpened}
        transactionHash={transactionHash}
        onClose={() => setSuccessModalOpened(false)}
        title="Transaction Signed!"
        message="Your contract execution has been submitted to the network."
      />

      {/* Transaction Review Modal */}
      <TxReviewModal
        opened={reviewModalOpened}
        onClose={() => setReviewModalOpened(false)}
        transactionData={transactionData}
        onConfirm={handleConfirmTransaction}
      />
    </Stack>
  );
};
