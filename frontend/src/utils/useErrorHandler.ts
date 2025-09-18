import { useCallback, useMemo, useState } from 'react';

import { Log, useEmitters } from '.';

// Interface for structured error information from backend
interface StructuredError {
  type: string;
  operation: string;
  collection: string;
  dataFacet: string;
  message: string;
}

// Parse error message to extract structured error information
const parseStructuredError = (errorMessage: string): StructuredError | null => {
  // Look for structured error patterns from our Go error types
  const patterns = [
    // Pattern: "validation error in names collection [tags]: invalid parameter"
    /^(\w+) error in (\w+) collection \[(\w+)\]: (.+)$/,
    // Pattern: "sdk error in chunks collection [stats] during fetch: command failed"
    /^(\w+) error in (\w+) collection \[(\w+)\] during (\w+): (.+)$/,
    // Pattern: "cache error in monitors collection [list]: cache not supported"
    /^(\w+) error in (\w+) collection \[(\w+)\]: (.+)$/,
  ];

  for (const pattern of patterns) {
    const match = errorMessage.match(pattern);
    if (match && match.length >= 5) {
      return {
        type: match[1] || 'unknown',
        collection: match[2] || 'unknown',
        dataFacet: match[3] || 'unknown',
        operation: match[4] || 'unknown',
        message: match[match.length - 1] || 'Unknown error', // Last capture group is always the message
      };
    }
  }

  return null;
};

// Generate user-friendly error messages based on error type
const getUserFriendlyMessage = (structured: StructuredError): string => {
  const collection = structured.collection;
  const operation = structured.operation;

  switch (structured.type) {
    case 'validation':
      return `Invalid ${structured.dataFacet} parameters for ${collection}. Please check your input and try again.`;

    case 'sdk':
      if (
        structured.message.includes('command not found') ||
        structured.message.includes('not installed')
      ) {
        return `Core is not properly installed or configured. Please check your installation.`;
      }
      if (structured.message.includes('cache')) {
        return `Cache operation failed for ${collection}. The requested data may not be available yet.`;
      }
      return `Failed to ${operation} ${structured.dataFacet} data from the core. Please try again or check your configuration.`;

    case 'cache':
      return `Cache operation not supported for ${structured.dataFacet} in ${collection}.`;

    case 'network':
      return `Network error while accessing ${collection} data. Please check your connection and try again.`;

    case 'store':
      return `Internal storage error for ${collection}. Please try refreshing the page.`;

    default:
      return (
        structured.message ||
        `An error occurred while working with ${collection} data.`
      );
  }
};

export const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  const { emitError } = useEmitters();

  const handleError = useCallback(
    (err: unknown, context: string) => {
      const e = err instanceof Error ? err : new Error(String(err));

      // Try to parse structured error information
      const structured = parseStructuredError(e.message);

      let userMessage: string;
      let logMessage: string;

      if (structured) {
        userMessage = getUserFriendlyMessage(structured);
        logMessage = `${structured.type} error in ${structured.collection}[${structured.dataFacet}] during ${structured.operation}: ${structured.message}`;
      } else {
        userMessage = `${e.message} ${context}`;
        logMessage = `Error in ${context}: ${e.message}`;
      }

      setError(e);
      emitError(userMessage);
      Log(logMessage);
    },
    [emitError],
  );

  const clearError = useCallback(() => setError(null), []);

  return useMemo(
    () => ({ error, handleError, clearError }),
    [error, handleError, clearError],
  );
};
