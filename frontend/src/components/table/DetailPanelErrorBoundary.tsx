import React, { ErrorInfo, ReactNode } from 'react';

import { Button, Code, Stack, Text } from '@mantine/core';

interface Props {
  children: ReactNode;
  facetKey?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class DetailPanelErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { facetKey, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <Stack
          gap="md"
          p="xl"
          align="center"
          justify="center"
          style={{
            minHeight: 200,
            border: '2px solid red',
            backgroundColor: '#ffe6e6',
            borderRadius: 'var(--mantine-radius-sm)',
          }}
        >
          <Text size="lg" fw={600} c="red">
            DetailPanel Error (Facet: {facetKey})
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            A React hooks violation occurred. This is likely caused by
            conditional rendering or changing panel components.
          </Text>
          {error && (
            <Code block style={{ maxWidth: '100%', overflow: 'auto' }}>
              {error.message}
            </Code>
          )}
          <Button onClick={this.handleReset} color="red" size="sm">
            Reset Panel
          </Button>
          <Text size="xs" c="dimmed">
            Check browser console for detailed logs
          </Text>
        </Stack>
      );
    }

    return this.props.children;
  }
}
