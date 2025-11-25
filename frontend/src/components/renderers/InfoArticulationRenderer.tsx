import { useEffect, useState } from 'react';

import { NameFromAddress } from '@app';
import { types } from '@models';

import { CustomSection, PanelRow, PanelTable } from '.';

// Component to display parameter value with address name resolution
const ParameterValue = ({ param }: { param: types.Parameter }) => {
  const [addressName, setAddressName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAddress =
      param.type === 'address' &&
      param.value &&
      typeof param.value === 'string' &&
      param.value.startsWith('0x') &&
      param.value.length === 42;

    if (isAddress) {
      setIsLoading(true);
      NameFromAddress(param.value as string)
        .then((result) => {
          if (result && typeof result === 'object' && 'name' in result) {
            setAddressName(result.name);
          }
        })
        .catch(() => {
          // Silently fail, just show the address
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [param.type, param.value]);

  const displayValue = param.value ? String(param.value) : '-';

  if (param.type === 'address' && addressName) {
    return (
      <div>
        <div style={{ fontWeight: 500 }}>{addressName}</div>
        <div style={{ fontSize: '10px', color: 'var(--mantine-color-dimmed)' }}>
          {displayValue}
        </div>
      </div>
    );
  }

  return <span>{isLoading ? `${displayValue}...` : displayValue}</span>;
};

export interface ArticulationInfo {
  functionData: types.Function;
  input?: string;
  to?: unknown;
  receipt?: {
    contractAddress?: unknown;
  };
}

interface InfoArticulationRendererProps {
  articulationInfo: ArticulationInfo;
}

/**
 * Convert hex bytes to ASCII string - strict mode
 * Fails if ANY characters are non-printable
 */
const hexToAscii = (hex: string): string => {
  if (!hex || hex.length < 2) return '';

  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;

  // Ensure even number of characters
  if (cleanHex.length % 2 !== 0) return '';

  let result = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    const hexPair = cleanHex.substr(i, 2);
    const charCode = parseInt(hexPair, 16);

    // STRICT: If ANY character is not printable ASCII (32-126), fail entirely
    if (charCode < 32 || charCode > 126) {
      return '';
    }

    result += String.fromCharCode(charCode);
  }

  // Only return if result has meaningful content (at least 4 characters)
  return result.length >= 4 ? result.trim() : '';
};

/**
 * Renders an articulated transaction function with inputs and outputs
 */
export const InfoArticulationRenderer = ({
  articulationInfo,
}: InfoArticulationRendererProps) => {
  const { functionData, input, to, receipt } = articulationInfo;
  const [contractName, setContractName] = useState<string | null>(null);
  const [isLoadingContractName, setIsLoadingContractName] = useState(false);

  // Helper function to check if all output values are null
  const hasNonNullOutputs = (outputs: types.Parameter[]): boolean => {
    return outputs.some(
      (param) => param.value !== null && param.value !== undefined,
    );
  };

  // Check if address is zero or zero-like
  const isZeroAddress = (address: unknown): boolean => {
    if (!address) return true;
    if (typeof address === 'string') {
      return address === '0x0' || address === '0x' || /^0x0+$/.test(address);
    }
    // Handle Address object with address array
    if (
      typeof address === 'object' &&
      address !== null &&
      'address' in address
    ) {
      const addrObj = address as { address?: number[] };
      if (Array.isArray(addrObj.address)) {
        return addrObj.address.every((byte: number) => byte === 0);
      }
    }
    return false;
  };

  // Check if this is a contract deployment
  const isContractDeployment =
    functionData.name === 'Unknown' && input && isZeroAddress(to);

  // Get ASCII message from input bytes
  const getAsciiMessage = (): string => {
    if (!input) return '';
    const decoded = hexToAscii(input);
    // Check if the decoded message contains readable characters
    const hasReadableChars = /[a-zA-Z0-9\s.,!?;:]/.test(decoded);
    return hasReadableChars ? decoded : '';
  };

  // Check if we should show message instead of decoded function
  const shouldShowMessage =
    functionData.name === 'Unknown' &&
    input &&
    !isContractDeployment &&
    getAsciiMessage().length > 0;

  // Load contract name for deployment
  useEffect(() => {
    if (isContractDeployment && receipt?.contractAddress) {
      setIsLoadingContractName(true);
      const contractAddr = receipt.contractAddress;

      // Convert address to hex string
      let addressHex = '';
      const typedAddr = contractAddr as { address?: number[] };
      if (typedAddr.address && Array.isArray(typedAddr.address)) {
        addressHex =
          '0x' +
          typedAddr.address
            .map((b: number) => b.toString(16).padStart(2, '0'))
            .join('');
      }

      if (addressHex && addressHex !== '0x' && !/^0x0+$/.test(addressHex)) {
        NameFromAddress(addressHex)
          .then((result) => {
            if (result && typeof result === 'object' && 'name' in result) {
              setContractName(result.name);
            }
          })
          .catch(() => {
            // Silently fail
          })
          .finally(() => {
            setIsLoadingContractName(false);
          });
      } else {
        setIsLoadingContractName(false);
      }
    }
  }, [isContractDeployment, receipt?.contractAddress]);

  const renderParameterTable = (
    parameters: types.Parameter[],
    title: string,
    showTitle: boolean = false,
  ) => {
    // Don't show header row if function is Unknown and input is 0x
    const shouldShowHeader =
      !showTitle && !(functionData.name === 'Unknown' && input === '0x');

    return (
      <CustomSection>
        {showTitle && (
          <div
            style={{
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '6px',
              marginTop: '12px',
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          <PanelTable>
            {shouldShowHeader && (
              <PanelRow layout="full" colSpan={2}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                  {functionData.name} ({functionData.encoding})
                </span>
              </PanelRow>
            )}
            {parameters && parameters.length > 0 ? (
              parameters
                .slice(0, 12)
                .map((param, index) => (
                  <PanelRow
                    key={index}
                    label={param.name || '-'}
                    value={<ParameterValue param={param} />}
                  />
                ))
            ) : (
              <PanelRow layout="full" colSpan={2}>
                <div
                  style={{
                    textAlign: 'left',
                    color: 'var(--mantine-color-dimmed)',
                    fontStyle: 'italic',
                  }}
                >
                  {functionData.name === 'Unknown'
                    ? 'Empty function call (no data)'
                    : 'Function takes no parameters'}
                </div>
              </PanelRow>
            )}
          </PanelTable>
        </div>
      </CustomSection>
    );
  };

  // If this is a contract deployment, show deployment info
  if (isContractDeployment) {
    const contractAddr = receipt?.contractAddress;
    let addressHex = '';
    const typedAddr = contractAddr as { address?: number[] };
    if (typedAddr?.address && Array.isArray(typedAddr.address)) {
      addressHex =
        '0x' +
        typedAddr.address
          .map((b: number) => b.toString(16).padStart(2, '0'))
          .join('');
    }

    return (
      <div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          Contract Deployment
        </div>
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--mantine-color-gray-0)',
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong>Contract Address:</strong> {addressHex || 'Not available'}
          </div>
          {contractName && (
            <div>
              <strong>Contract Name:</strong> {contractName}
            </div>
          )}
          {isLoadingContractName && (
            <div
              style={{
                fontStyle: 'italic',
                color: 'var(--mantine-color-dimmed)',
              }}
            >
              Loading contract name...
            </div>
          )}
        </div>
      </div>
    );
  }

  // If function is Unknown and we have input data, show the ASCII message
  if (shouldShowMessage) {
    const asciiMessage = getAsciiMessage();
    return (
      <div>
        <div
          style={{
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '4px',
            marginTop: '8px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <tbody>
              <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <td
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    verticalAlign: 'top',
                  }}
                  colSpan={2}
                >
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>
                    Message
                  </span>
                </td>
              </tr>
              <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <td
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                  }}
                >
                  {asciiMessage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderParameterTable(functionData.inputs || [], 'Inputs')}
      {functionData.outputs &&
        functionData.outputs.length > 0 &&
        hasNonNullOutputs(functionData.outputs) &&
        renderParameterTable(functionData.outputs, 'Outputs', true)}
    </div>
  );
};

export const txToArticulationInfo = (
  transaction: types.Transaction,
): ArticulationInfo => {
  // Create synthetic function from input data if no articulatedTx exists
  const createSyntheticFunction = (input: string): types.Function => {
    if (input.length < 10) {
      return {
        name: 'Unknown',
        encoding: input || '0x',
        inputs: [],
        outputs: [],
      } as unknown as types.Function;
    }

    const encoding = input.slice(0, 10);
    const remainingData = input.slice(10);
    const inputs: types.Parameter[] = [];

    for (let i = 0; i < remainingData.length; i += 64) {
      const chunk = remainingData.slice(i, i + 64);
      if (chunk.length > 0) {
        inputs.push({
          name: `param_${Math.floor(i / 64)}`,
          value: '0x' + chunk,
          type: 'bytes32',
        } as types.Parameter);
      }
    }

    return {
      name: 'Unknown',
      encoding,
      inputs,
      outputs: [],
    } as unknown as types.Function;
  };

  return {
    functionData:
      transaction.articulatedTx ||
      createSyntheticFunction(transaction.input || ''),
    input: transaction.input,
    to: transaction.to,
    receipt: transaction.receipt,
  };
};
