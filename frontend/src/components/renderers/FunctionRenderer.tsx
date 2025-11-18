import { useEffect, useState } from 'react';

import { NameFromAddress } from '@app';
import { types } from '@models';

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

interface FunctionRendererProps {
  functionData: types.Function;
}

/**
 * Renders an articulated transaction function with inputs and outputs
 */
export const FunctionRenderer = ({ functionData }: FunctionRendererProps) => {
  const renderParameterTable = (
    parameters: types.Parameter[],
    title: string,
  ) => {
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
          {title}
        </div>
        <div
          style={{
            maxHeight: '200px',
            overflow: 'auto',
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '4px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                <th
                  style={{
                    padding: '6px 0px 6px 0px',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    fontWeight: 500,
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: '6px 8px',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--mantine-color-gray-3)',
                    fontWeight: 500,
                  }}
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {parameters && parameters.length > 0 ? (
                parameters.slice(0, 12).map((param, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: '4px 0px 4px 0px',
                        borderBottom: '1px solid var(--mantine-color-gray-2)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '120px',
                        verticalAlign: 'top',
                      }}
                    >
                      {param.name || '-'}
                    </td>
                    <td
                      style={{
                        padding: '4px 8px',
                        borderBottom: '1px solid var(--mantine-color-gray-2)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        verticalAlign: 'top',
                      }}
                    >
                      <ParameterValue param={param} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      padding: '8px',
                      textAlign: 'left',
                      color: 'var(--mantine-color-dimmed)',
                      fontStyle: 'italic',
                    }}
                  >
                    No parameters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          fontSize: '16px',
          fontWeight: 700,
          marginBottom: '12px',
        }}
      >
        {functionData.name} ({functionData.encoding})
      </div>
      {renderParameterTable(functionData.inputs || [], 'Inputs')}
      {functionData.outputs &&
        functionData.outputs.length > 0 &&
        renderParameterTable(functionData.outputs, 'Outputs')}
    </div>
  );
};
