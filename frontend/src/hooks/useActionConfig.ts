import { useCallback, useState } from 'react';

import { FormField } from '@components';
import { addressToHex } from '@utils';

interface ActionableItem {
  address?: unknown;
  deleted?: boolean;
  processing?: boolean;
}

// Define available operations
export type ActionOperation =
  | 'delete'
  | 'undelete'
  | 'remove'
  | 'autoname'
  | 'clean'
  | 'clean-one'
  | 'explore';

// Simple action configuration
export interface ActionConfigOptions {
  operations: ActionOperation[];
}

// Action data for rendering
export interface ActionData {
  addressStr: string;
  isProcessing: boolean;
  isDeleted: boolean;
  operations: ActionOperation[];
  canRemove?: boolean;
}

/**
 * A simplified hook for managing action configurations in data tables.
 * This replaces the complex CRUD operations in Section 6 with a simple configuration approach.
 */
export const useActionConfig = (options: ActionConfigOptions) => {
  const [processingAddresses, setProcessingAddresses] = useState<Set<string>>(
    new Set(),
  );

  // Start processing an address
  const startProcessing = useCallback((address: string) => {
    setProcessingAddresses((prev) => new Set(prev).add(address));
  }, []);

  // Stop processing an address
  const stopProcessing = useCallback((address: string) => {
    setTimeout(() => {
      setProcessingAddresses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(address);
        return newSet;
      });
    }, 100);
  }, []);

  // Function to create action data for a row
  const createActionData = useCallback(
    (row: ActionableItem, canRemove = true): ActionData => {
      const addressStr = addressToHex(row.address);
      const isProcessing =
        Boolean(row.processing) || processingAddresses.has(addressStr);
      const isDeleted = Boolean(row.deleted);

      return {
        addressStr,
        isProcessing,
        isDeleted,
        operations: options.operations,
        canRemove,
      };
    },
    [options.operations, processingAddresses],
  );

  // Function to inject action column with custom renderer
  const injectActionColumn = useCallback(
    (
      baseColumns: FormField[],
      renderActions: (data: ActionData) => React.ReactNode,
      getCanRemove?: (row: Record<string, unknown>) => boolean,
    ) => {
      // If no operations, filter out actions column
      if (options.operations.length === 0) {
        return baseColumns.filter((col) => col.key !== 'actions');
      }

      // Create actions column override
      const actionsOverride: Partial<FormField> = {
        sortable: false,
        editable: false,
        visible: true,
        render: (row: Record<string, unknown>) => {
          const canRemove = getCanRemove ? getCanRemove(row) : true;
          const actionData = createActionData(row as ActionableItem, canRemove);
          return renderActions(actionData);
        },
      };

      // Replace actions column with our override
      return baseColumns.map((col) =>
        col.key === 'actions' ? { ...col, ...actionsOverride } : col,
      );
    },
    [options.operations, createActionData],
  );

  return {
    operations: options.operations,
    processingAddresses,
    startProcessing,
    stopProcessing,
    createActionData,
    injectActionColumn,
  };
};
