import React, { useEffect, useMemo, useState } from 'react';

import { StyledBadge, StyledButton, StyledText } from '@components';
import {
  Alert,
  Card,
  Grid,
  Group,
  Loader,
  Stack,
  Tooltip,
} from '@mantine/core';
import { types } from '@models';

import { getReadFunctions } from './facetCreation';

interface ContractDashboardProps {
  contractState: types.Contract;
}

interface FunctionResult {
  function: types.Function;
  loading: boolean;
  lastUpdated?: number;
}

export const ContractDashboard: React.FC<ContractDashboardProps> = ({
  contractState,
}) => {
  const [functionResults, setFunctionResults] = useState<
    Record<string, FunctionResult>
  >({});
  const [loading, setLoading] = useState(true);

  const readFunctions = useMemo(() => {
    const functions = contractState.abi
      ? getReadFunctions(contractState.abi)
      : [];
    return functions;
  }, [contractState.abi]);

  // Initialize function results state
  useEffect(() => {
    const initialResults: Record<string, FunctionResult> = {};
    readFunctions.forEach((func) => {
      let functionWithResults = func;
      if (contractState.readResults?.[func.name] !== undefined) {
        const result = contractState.readResults[func.name];

        // DINGLEBERRY: USE THE PARAMETER VALUES SINCE THIS NEVER IS NOT TRUE
        // Compare readResults with ABI output values
        // Find the matching function in the ABI by name
        // const abiFunctions = contractState.abi?.functions || [];
        // const matchingAbiFunction = abiFunctions.find(
        //   (abiFunc) => abiFunc.name === func.name,
        // );

        // if (
        //   matchingAbiFunction &&
        //   matchingAbiFunction.outputs &&
        //   matchingAbiFunction.outputs.length > 0
        // ) {
        //   matchingAbiFunction.outputs.forEach((output, index) => {
        // const abiOutputValue = output.value;
        // const readResultValue = Array.isArray(result)
        //   ? result[index]
        //   : result;
        // // const isMatch =
        // //   JSON.stringify(abiOutputValue) ===
        // //   JSON.stringify(readResultValue);
        // const status = isMatch ? '✅' : '❌';
        // Log(
        //   `Function ${func.name} output ${index} match: ${status} (ABI: ${JSON.stringify(
        //     abiOutputValue,
        //   )}, Read Result: ${JSON.stringify(readResultValue)})`,
        // );
        //   });
        // }

        if (func.outputs && func.outputs.length > 0) {
          const updatedOutputs = func.outputs.map((output, index) => {
            const outputValue =
              func.outputs.length === 1
                ? result
                : Array.isArray(result)
                  ? result[index]
                  : result;

            return types.Parameter.createFrom({
              ...output,
              value: outputValue,
            });
          });

          functionWithResults = types.Function.createFrom({
            ...func,
            outputs: updatedOutputs,
          });
        }
      }

      initialResults[func.name] = {
        function: functionWithResults,
        loading: false,
        lastUpdated: Number(contractState.lastUpdated),
      };
    });

    setFunctionResults(initialResults);
    setLoading(false);
  }, [contractState, readFunctions]);

  // Call a specific read function
  const _callReadFunction = async (func: types.Function) => {
    const currentResult = functionResults[func.name];
    if (!currentResult) return;

    setFunctionResults((prev) => ({
      ...prev,
      [func.name]: {
        ...currentResult,
        loading: true,
      },
    }));

    try {
      // TODO: Replace with actual API call to execute read function
      const response = await fetch(
        `/api/contracts/${contractState.address}/call/${func.name}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            function: func,
            inputs: [], // Read functions typically have no inputs or use defaults
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to call function ${func.name}`);
      }

      const result = await response.json();

      // Update the function with the new result
      const currentFunction = currentResult.function;
      if (currentFunction) {
        // Create updated outputs with new values
        const updatedOutputs = currentFunction.outputs.map(
          (output: types.Parameter, index: number) =>
            types.Parameter.createFrom({
              ...output,
              value: Array.isArray(result.data)
                ? result.data[index]
                : result.data,
            }),
        );

        // Create updated function with new outputs
        const updatedFunction = types.Function.createFrom({
          ...currentFunction,
          outputs: updatedOutputs,
          message: undefined, // Clear any previous error
        });

        setFunctionResults((prev) => ({
          ...prev,
          [func.name]: {
            function: updatedFunction,
            loading: false,
            lastUpdated: Date.now(),
          },
        }));
      }
    } catch (error) {
      // Update function with error message
      const currentFunction = currentResult.function;
      if (currentFunction) {
        const errorFunction = types.Function.createFrom({
          ...currentFunction,
          message: error instanceof Error ? error.message : 'Unknown error',
        });

        setFunctionResults((prev) => ({
          ...prev,
          [func.name]: {
            function: errorFunction,
            loading: false,
            lastUpdated: currentResult.lastUpdated,
          },
        }));
      }
    }
  };

  // Get the display value from function outputs
  const getFunctionResult = (result: FunctionResult): unknown => {
    if (!result.function.outputs || result.function.outputs.length === 0) {
      return null;
    }

    if (result.function.outputs.length === 1) {
      return result.function.outputs[0]?.value;
    }

    // For multiple outputs, return an array of values
    return result.function.outputs.map((output) => output.value);
  };

  // Check if function has an error
  const getFunctionError = (result: FunctionResult): string | undefined => {
    return result.function.message;
  };

  // Format the result value for display
  const formatResult = (result: unknown): string => {
    if (result === null || result === undefined) {
      return 'null';
    }

    if (typeof result === 'string') {
      return result;
    }

    if (typeof result === 'number' || typeof result === 'bigint') {
      return result.toString();
    }

    if (typeof result === 'boolean') {
      return result ? 'true' : 'false';
    }

    if (Array.isArray(result)) {
      return `[${result.map((item) => formatResult(item)).join(', ')}]`;
    }

    if (typeof result === 'object') {
      return JSON.stringify(result, null, 2);
    }

    return String(result);
  };

  // Check if we have any functions to display from ABI
  const hasReadFunctions = readFunctions.length > 0;

  // Show loading state while data is being processed
  if (loading) {
    return (
      <Stack gap="md" align="center" style={{ padding: '2rem' }}>
        <Loader size="lg" />
        <StyledText variant="dimmed" size="md">
          Loading contract functions...
        </StyledText>
      </Stack>
    );
  }

  if (!hasReadFunctions) {
    return (
      <Alert variant="light">
        This contract has no read functions (view/pure) to display
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Group align="flex-start" gap="md" style={{ width: '100%' }}>
        {/* Sidebar for functions with no inputs */}
        <Card
          shadow="sm"
          padding="md"
          radius="md"
          withBorder
          style={{ minWidth: '280px', maxWidth: '320px', flex: '0 0 auto' }}
        >
          <Stack gap="xs">
            <StyledText variant="dimmed" size="sm">
              Read Functions (No Input)
            </StyledText>
            {Object.entries(functionResults)
              .filter(
                ([, result]) =>
                  !result.function.inputs ||
                  result.function.inputs.length === 0,
              )
              .map(([functionName, result]) => {
                const func = result.function;
                return (
                  <div
                    key={functionName}
                    style={{
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                      paddingBottom: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <Group justify="space-between" align="center" gap="xs">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <StyledText variant="primary" size="xs" fw={600}>
                          {functionName}
                        </StyledText>
                        <StyledBadge variant="light" size="xs">
                          {func.outputs && func.outputs.length > 0
                            ? func.outputs.length === 1
                              ? func.outputs[0]?.type || 'unknown'
                              : `(${func.outputs.map((output) => output.type).join(', ')})`
                            : 'void'}
                        </StyledBadge>
                      </div>
                      <Tooltip label="Refresh this function">
                        <StyledButton
                          size="xs"
                          variant="subtle"
                          onClick={() => {
                            // TODO: Implement actual function calling when API is ready
                          }}
                          loading={result?.loading}
                          style={{
                            minWidth: 'auto',
                            width: '20px',
                            height: '20px',
                            padding: 0,
                          }}
                        >
                          ↻
                        </StyledButton>
                      </Tooltip>
                    </Group>
                    <div style={{ marginTop: '4px' }}>
                      {result?.loading ? (
                        <Group gap="xs">
                          <Loader size="xs" />
                          <StyledText variant="dimmed" size="xs">
                            Loading...
                          </StyledText>
                        </Group>
                      ) : result && getFunctionError(result) ? (
                        <StyledText variant="error" size="xs">
                          Error: {getFunctionError(result)}
                        </StyledText>
                      ) : (
                        <StyledText variant="primary" size="xs">
                          {result
                            ? formatResult(getFunctionResult(result))
                            : 'No result'}
                        </StyledText>
                      )}
                    </div>
                  </div>
                );
              })}
          </Stack>
        </Card>

        {/* Main content area for functions with inputs */}
        <div style={{ flex: 1 }}>
          <Grid>
            {Object.entries(functionResults)
              .filter(
                ([, result]) =>
                  result.function.inputs && result.function.inputs.length > 0,
              )
              .map(([functionName, result]) => {
                const func = result.function;
                return (
                  <Grid.Col
                    key={functionName}
                    span={{ base: 12, md: 6, lg: 4 }}
                  >
                    <Card shadow="sm" padding="md" radius="md" withBorder>
                      <Stack gap="xs">
                        <Group justify="space-between" align="flex-start">
                          <div style={{ flex: 1 }}>
                            <StyledText variant="primary" size="sm" fw={600}>
                              {functionName}
                              <StyledText variant="dimmed" size="xs">
                                (input)
                              </StyledText>
                            </StyledText>
                            <StyledBadge variant="light" size="xs">
                              {func.outputs && func.outputs.length > 0
                                ? func.outputs.length === 1
                                  ? func.outputs[0]?.type || 'unknown'
                                  : `(${func.outputs.map((output) => output.type).join(', ')})`
                                : 'void'}
                            </StyledBadge>
                          </div>
                          <Tooltip label="Refresh this function">
                            <StyledButton
                              size="xs"
                              variant="subtle"
                              onClick={() => {
                                // TODO: Implement actual function calling when API is ready
                              }}
                              loading={result?.loading}
                            >
                              ↻
                            </StyledButton>
                          </Tooltip>
                        </Group>

                        <div>
                          {result?.loading ? (
                            <Group gap="xs">
                              <Loader size="xs" />
                              <StyledText variant="dimmed" size="xs">
                                Loading...
                              </StyledText>
                            </Group>
                          ) : result && getFunctionError(result) ? (
                            <Alert
                              variant="light"
                              bd="1px solid var(--mantine-color-error-6)"
                            >
                              <StyledText variant="primary" size="xs">
                                {getFunctionError(result)}
                              </StyledText>
                            </Alert>
                          ) : (
                            <div>
                              <StyledText variant="primary" size="sm">
                                {result
                                  ? formatResult(getFunctionResult(result))
                                  : 'No result'}
                              </StyledText>
                              {result?.lastUpdated && (
                                <StyledText variant="dimmed" size="xs">
                                  Updated:{' '}
                                  {new Date(
                                    result.lastUpdated,
                                  ).toLocaleTimeString()}
                                </StyledText>
                              )}
                            </div>
                          )}
                        </div>
                      </Stack>
                    </Card>
                  </Grid.Col>
                );
              })}
          </Grid>
        </div>
      </Group>
    </Stack>
  );
};
