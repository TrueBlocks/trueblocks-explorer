import { useMemo } from 'react';

import { Action } from '@components';
import { FormField } from '@components';
import { ActionType } from '@hooks';
import { types } from '@models';
import { addressToHex } from '@utils';

import type { ActionData } from './useActionConfig';

interface ColumnConfig<T extends Record<string, unknown>> {
  showActions?: boolean | ((pageData: PageDataUnion) => boolean);
  actions: ActionType[];
  getCanRemove?: (row: T, pageData?: PageDataUnion) => boolean;
  getCanToggle?: (row: T, pageData?: PageDataUnion) => boolean;
  getId?: (row: T) => string;
}

type PageDataUnion = {
  facet: types.DataFacet;
  [key: string]: unknown;
} | null;

export function toPageDataProp<T>(pageData: T | null): PageDataUnion {
  return pageData as unknown as PageDataUnion;
}

interface ActionHandlers {
  handleToggle?: (id: string) => void;
  handleRemove?: (id: string) => void;
  handleAutoname?: (id: string) => void;
  handleUpdate?: (row: Record<string, unknown>) => void;
}

export interface ActionConfig {
  rowActions: Array<{
    type: string;
    icon: string;
    title: string;
    requiresWallet: boolean;
  }>;
  isWalletConnected?: boolean;
}

export const useColumns = (
  baseColumns: FormField<Record<string, unknown>>[],
  config: ColumnConfig<Record<string, unknown>>,
  handlers: ActionHandlers,
  pageData: PageDataUnion,
  actionConfig: ActionConfig,
) => {
  return useMemo(() => {
    // Determine if actions should be shown
    const shouldShow =
      typeof config.showActions === 'function'
        ? config.showActions(pageData)
        : (config.showActions ?? true);

    if (!shouldShow || actionConfig.rowActions.length === 0) {
      return baseColumns.filter((col) => col.key !== 'actions');
    }

    const renderActions = (
      actionData: ActionData,
      row: Record<string, unknown>,
    ) => {
      const isDeleted = actionData.isDeleted;
      const newState = actionData.isProcessing ? !isDeleted : isDeleted;

      return (
        <div className="action-buttons-container">
          {actionConfig.rowActions.map((action) => {
            if (action.type === 'delete' && handlers.handleToggle) {
              const canToggle = config.getCanToggle
                ? config.getCanToggle(row as Record<string, unknown>, pageData)
                : true;
              return (
                <Action
                  key={action.type}
                  icon="Delete"
                  iconOff="Undelete"
                  isOn={!newState}
                  onClick={() => handlers.handleToggle?.(actionData.addressStr)}
                  disabled={actionData.isProcessing || !canToggle}
                  title={newState ? 'Undelete' : 'Delete'}
                  size="sm"
                />
              );
            }

            if (action.type === 'remove' && handlers.handleRemove) {
              return (
                <Action
                  key={action.type}
                  icon="Remove"
                  onClick={() => handlers.handleRemove?.(actionData.addressStr)}
                  disabled={actionData.isProcessing || !actionData.canRemove}
                  title="Remove"
                  size="sm"
                />
              );
            }

            if (action.type === 'autoname' && handlers.handleAutoname) {
              return (
                <Action
                  key={action.type}
                  icon="Autoname"
                  onClick={() =>
                    handlers.handleAutoname?.(actionData.addressStr)
                  }
                  disabled={actionData.isProcessing}
                  title="Auto-generate name"
                  size="sm"
                />
              );
            }

            if (action.type === 'update' && handlers.handleUpdate) {
              return (
                <Action
                  key={action.type}
                  icon="Update"
                  onClick={() => handlers.handleUpdate?.(row)}
                  disabled={actionData.isProcessing}
                  title="Update"
                  size="sm"
                />
              );
            }

            return null;
          })}
        </div>
      );
    };

    const actionsOverride: Partial<FormField<Record<string, unknown>>> = {
      sortable: false,
      editable: false,
      visible: true,
      render: (row: Record<string, unknown>) => {
        const canRemove = config.getCanRemove ? config.getCanRemove(row) : true;
        const addressStr = config.getId
          ? config.getId(row)
          : addressToHex(row.address);
        const isProcessing = Boolean(row.processing);
        const isDeleted = Boolean(row.deleted);
        const actionData = {
          addressStr,
          isProcessing,
          isDeleted,
          operations: config.actions as unknown as ActionData['operations'],
          canRemove,
        };

        return renderActions(actionData, row);
      },
    };

    // Replace actions column with our override
    return baseColumns.map((col) =>
      col.key === 'actions' ? { ...col, ...actionsOverride } : col,
    );
  }, [baseColumns, config, handlers, pageData, actionConfig]);
};

export type { ColumnConfig, ActionHandlers };
