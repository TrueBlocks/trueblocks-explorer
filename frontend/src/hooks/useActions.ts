import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExecuteRowAction, ExportData, IsDialogSilenced } from '@app';
import { useViewContext } from '@contexts';
import { crud, project, sdk, types } from '@models';
import {
  Log,
  LogError,
  addressToHex,
  getDisplayAddress,
  useErrorHandler,
} from '@utils';
// TODO: BOGUS add an @contracts alias for this import
import { TransactionData, buildTransaction } from '@wallet';
import { useWalletGatedAction } from '@wallet';

import { useActionMsgs } from './useActionMsgs';

const debug = false;

// Constants for the unchainedindex.eth contract
const UNCHAINED_INDEX_CONTRACT = '0x0c316b7042b419d07d343f2f4f5bd54ff731183d';

export type ActionType =
  | 'publish'
  | 'pin'
  | 'create'
  | 'delete'
  | 'remove'
  | 'autoname'
  | 'export'
  | 'clean'
  | 'update'
  | 'speak';

// Action definition with level, wallet requirements
export interface ActionDefinition {
  type: ActionType;
  level: 'row' | 'header' | 'both';
  requiresWallet: boolean;
  title: string;
  icon: string;
}

export interface CollectionActionsConfig<
  TPageData extends { totalItems: number },
  TItem,
> {
  collection: string;
  viewStateKey: project.ViewStateKey;
  pagination: ReturnType<
    typeof import('@components').usePagination
  >['pagination'];
  goToPage: ReturnType<typeof import('@components').usePagination>['goToPage'];
  sort: ReturnType<typeof import('@contexts').useSorting>['sort'];
  filter: ReturnType<typeof import('@contexts').useFiltering>['filter'];
  viewConfig: types.ViewConfig;
  pageData: TPageData | null;
  setPageData: React.Dispatch<React.SetStateAction<TPageData | null>>;
  setTotalItems: (total: number) => void;
  crudFunc: (
    payload: types.Payload,
    operation: crud.Operation,
    item: TItem,
  ) => Promise<void>;
  pageFunc: (
    payload: types.Payload,
    offset: number,
    limit: number,
    sort: sdk.SortSpec,
    filter: string,
  ) => Promise<TPageData>;
  pageClass: new (data: Record<string, unknown>) => TPageData;
  updateItem: TItem;
  cleanFunc?: (payload: types.Payload, addresses: string[]) => Promise<void>;
  postFunc?: (item: TItem) => TItem;
  createPayload: (facet: types.DataFacet, address?: string) => types.Payload;
  getCurrentDataFacet: () => types.DataFacet;
}

// Predefined action definitions
const ACTION_DEFINITIONS: Record<string, ActionDefinition> = {
  publish: {
    type: 'publish',
    level: 'header',
    requiresWallet: true,
    title: 'Publish',
    icon: 'Publish',
  },
  pin: {
    type: 'pin',
    level: 'header',
    requiresWallet: false,
    title: 'Pin',
    icon: 'Pin',
  },
  create: {
    type: 'create',
    level: 'header',
    requiresWallet: false,
    title: 'Create',
    icon: 'Create',
  },
  export: {
    type: 'export',
    level: 'header',
    requiresWallet: false,
    title: 'Export',
    icon: 'Export',
  },
  delete: {
    type: 'delete',
    level: 'row',
    requiresWallet: false,
    title: 'Delete',
    icon: 'Delete',
  },
  remove: {
    type: 'remove',
    level: 'row',
    requiresWallet: false,
    title: 'Remove',
    icon: 'Remove',
  },
  autoname: {
    type: 'autoname',
    level: 'row',
    requiresWallet: false,
    title: 'Auto-generate name',
    icon: 'Autoname',
  },
  clean: {
    type: 'clean',
    level: 'header',
    requiresWallet: false,
    title: 'Clean',
    icon: 'Clean',
  },
  update: {
    type: 'update',
    level: 'row',
    requiresWallet: false,
    title: 'Update',
    icon: 'Update',
  },
  speak: {
    type: 'speak',
    level: 'header',
    requiresWallet: false,
    title: 'Speak',
    icon: 'Speak',
  },
};

export const useActions = <TPageData extends { totalItems: number }, TItem>(
  config: CollectionActionsConfig<TPageData, TItem>,
) => {
  const { setPendingRowAction } = useViewContext();
  const {
    collection,
    viewStateKey,
    pagination,
    goToPage,
    sort,
    filter,
    viewConfig,
    pageData,
    setPageData,
    setTotalItems,
    crudFunc,
    pageFunc,
    postFunc,
    createPayload,
    getCurrentDataFacet,
    pageClass,
    updateItem,
    cleanFunc,
  } = config;

  const { isWalletConnected, createWalletGatedAction } = useWalletGatedAction();
  const { emitSuccess } = useActionMsgs(
    collection as 'names' | 'monitors' | 'abis',
  );

  const currentDataFacet = useMemo(
    () => getCurrentDataFacet(),
    [getCurrentDataFacet],
  );

  // Transaction modal state for publish functionality
  const [transactionModal, setTransactionModal] = useState<{
    opened: boolean;
    transactionData: TransactionData | null;
  }>({
    opened: false,
    transactionData: null,
  });

  // Pending publish action state
  const [pendingPublish, setPendingPublish] = useState(false);

  // Export format modal state
  const [exportFormatModal, setExportFormatModal] = useState<{
    opened: boolean;
    pendingPayload: types.Payload | null;
  }>({
    opened: false,
    pendingPayload: null,
  });

  // Unified confirm modal
  const [confirmModal, setConfirmModal] = useState<{
    opened: boolean;
    title: string;
    message: string;
    dialogKey: string;
    onConfirm: (() => void) | null;
  }>({
    opened: false,
    title: '',
    message: '',
    dialogKey: '',
    onConfirm: null,
  });

  const openConfirm = useCallback(
    (opts: {
      title: string;
      message: string;
      dialogKey: string;
      onConfirm: () => void;
    }) => {
      setConfirmModal({
        opened: true,
        title: opts.title,
        message: opts.message,
        dialogKey: opts.dialogKey,
        onConfirm: opts.onConfirm,
      });
    },
    [],
  );
  const closeConfirm = useCallback(
    () => setConfirmModal((p) => ({ ...p, opened: false })),
    [],
  );

  // Check silenced state and either execute immediately or open confirm
  const askConfirmOrExecute = useCallback(
    async (opts: {
      title: string;
      message: string;
      dialogKey: string;
      onConfirm: () => void;
    }) => {
      try {
        const silenced = await IsDialogSilenced(opts.dialogKey);
        if (silenced) {
          opts.onConfirm();
          return;
        }
      } catch (error) {
        // Fall through to showing confirm if check fails
        LogError('Checking dialog silence state:', String(error));
      }
      openConfirm(opts);
    },
    [openConfirm],
  );

  // Execute pending publish when wallet connects
  const executePendingPublish = useCallback(() => {
    if (!pendingPublish || !isWalletConnected) return;

    setPendingPublish(false);
    try {
      // Create a mock function definition for publishHash(string,string)
      const publishHashFunction: types.Function = {
        name: 'publishHash',
        type: 'function',
        inputs: [
          new types.Parameter({ name: 'chain', type: 'string' }),
          new types.Parameter({ name: 'hash', type: 'string' }),
        ],
        outputs: [],
        stateMutability: 'nonpayable',
        encoding: '0x1fee5cd2', // From the chifra abis command
        convertValues: () => {},
      };

      // Create transaction inputs - you can customize these values as needed
      const transactionInputs = [
        { name: 'chain', type: 'string', value: 'mainnet' },
        {
          name: 'hash',
          type: 'string',
          value: 'QmYjUzLhetTPovBydBoVuzCYnDRABWtfjeBL6JbxopadJG',
        },
      ];

      // Build the transaction
      const transactionData = buildTransaction(
        UNCHAINED_INDEX_CONTRACT,
        publishHashFunction,
        transactionInputs,
      );

      setTransactionModal({
        opened: true,
        transactionData,
      });
    } catch (error) {
      LogError('Creating pending publish transaction:', String(error));
    }
  }, [pendingPublish, isWalletConnected]);

  // Watch for wallet connection to execute pending publish
  useEffect(() => {
    executePendingPublish();
  }, [executePendingPublish]);

  // Items property name (derived from collection name)
  const itemsProperty = collection;

  // Derive actions dynamically from backend ViewConfig for current facet
  const { headerActions, rowActions } = useMemo(() => {
    const facetKey = currentDataFacet as unknown as string;
    const facetCfg = viewConfig?.facets?.[facetKey];
    const headerIds: string[] = facetCfg?.headerActions || [];
    const rowIds: string[] = facetCfg?.actions || [];

    const toDef = (id: string): ActionDefinition | null =>
      ACTION_DEFINITIONS[id] || null;

    return {
      headerActions: headerIds
        .map(toDef)
        .filter((a): a is ActionDefinition => Boolean(a)),
      rowActions: rowIds
        .map(toDef)
        .filter((a): a is ActionDefinition => Boolean(a)),
    };
  }, [viewConfig, currentDataFacet]);

  const { clearError, handleError } = useErrorHandler();

  // Handler implementations
  const handleCreate = useCallback(() => {
    Log(`Creating ${collection}`);
    // TODO: Implement create functionality
  }, [collection]);

  const handleSpeak = useCallback(() => {
    Log(
      `[Speak] action invoked for collection=${collection} facet=${String(
        currentDataFacet,
      )}`,
    );
    // Placeholder: extend to do TTS or other functionality
  }, [collection, currentDataFacet]);

  const handleExport = useCallback(async () => {
    const facet = getCurrentDataFacet();
    const payload = createPayload(facet);
    payload.collection = collection;

    try {
      const isDialogSilenced = await IsDialogSilenced('exportFormat');

      if (isDialogSilenced) {
        ExportData(payload)
          .then(() => {
            // do nothing - the backend did it all
          })
          .catch((error) => {
            LogError(
              `[EXPORT FRONTEND] Export failed for ${collection}: ${error}`,
            );
          });
      } else {
        setExportFormatModal({
          opened: true,
          pendingPayload: payload,
        });
      }
    } catch (error) {
      LogError(
        `[EXPORT FRONTEND] Error checking dialog silence state: ${error}`,
      );
      setExportFormatModal({
        opened: true,
        pendingPayload: payload,
      });
    }
  }, [collection, getCurrentDataFacet, createPayload]);

  // Handle format selection from modal
  const handleFormatSelected = useCallback(
    (format: string) => {
      const payload = exportFormatModal.pendingPayload;
      if (!payload) {
        LogError('[handleFormatSelected] No pending payload found');
        return;
      }

      payload.format = format;
      ExportData(payload)
        .then(() => {
          // do nothing - the backend did it all
        })
        .catch((error) => {
          LogError(
            `[EXPORT FRONTEND] Export failed for ${collection}: ${error}`,
          );
        });
    },
    [collection, exportFormatModal.pendingPayload],
  );

  // Handle modal close
  const handleExportFormatModalClose = useCallback(() => {
    setExportFormatModal({
      opened: false,
      pendingPayload: null,
    });
  }, []);

  const handlePublish = useCallback(() => {
    Log(`Publish button clicked for ${collection}`);

    if (!isWalletConnected) {
      Log(
        'Wallet not connected, setting pending publish and triggering connection',
      );
      setPendingPublish(true);
      // Trigger wallet connection through the existing wallet gated action pattern
      createWalletGatedAction(() => {}, collection)();
      return;
    }

    // Wallet is already connected, execute immediately
    Log(`Publishing ${collection} with connected wallet`);

    try {
      // Create a mock function definition for publishHash(string,string)
      const publishHashFunction: types.Function = {
        name: 'publishHash',
        type: 'function',
        inputs: [
          new types.Parameter({ name: 'chain', type: 'string' }),
          new types.Parameter({ name: 'hash', type: 'string' }),
        ],
        outputs: [],
        stateMutability: 'nonpayable',
        encoding: '0x1fee5cd2', // From the chifra abis command
        convertValues: () => {},
      };

      // Create transaction inputs - you can customize these values as needed
      // TODO: THIS CANNOT BE HARD CODED
      const transactionInputs = [
        { name: 'chain', type: 'string', value: 'mainnet' },
        {
          name: 'hash',
          type: 'string',
          value: 'QmYjUzLhetTPovBydBoVuzCYnDRABWtfjeBL6JbxopadJG',
        },
      ];

      // Build the transaction
      const transactionData = buildTransaction(
        UNCHAINED_INDEX_CONTRACT,
        publishHashFunction,
        transactionInputs,
      );

      Log('Transaction data created:', JSON.stringify(transactionData));

      // Open the transaction modal
      setTransactionModal({
        opened: true,
        transactionData,
      });

      Log('Transaction modal state set to opened');
    } catch (error) {
      LogError('Creating publish transaction:', String(error));
    }
  }, [collection, isWalletConnected, createWalletGatedAction]);

  const handlePin = useCallback(() => {
    Log(`Pinning ${collection}`);
    // TODO: Implement pin functionality
  }, [collection]);

  const performToggle = useCallback(
    (address: string) => {
      clearError();

      try {
        const items = pageData
          ? (pageData as Record<string, unknown>)[itemsProperty]
          : null;
        if (!Array.isArray(items)) {
          handleError(
            new Error(`No valid items array found for ${collection}`),
            `handleToggle for ${address}`,
          );
          return;
        }
        const original = [...(items as TItem[])];

        const currentItem = original.find((item: TItem) => {
          const itemAddress = addressToHex(
            (item as Record<string, unknown>).address,
          );
          return itemAddress === address;
        });

        if (!currentItem) {
          handleError(
            new Error(`Item ${address} not found in ${collection}`),
            `handleToggle for ${address}`,
          );
          return;
        }

        const isCurrentlyDeleted = Boolean(
          (currentItem as Record<string, unknown>)?.deleted,
        );
        const newDeletedState = !isCurrentlyDeleted;
        const operation = newDeletedState
          ? crud.Operation.DELETE
          : crud.Operation.UNDELETE;

        const optimisticValues = original.map((item: TItem) => {
          const itemAddress = addressToHex(
            (item as Record<string, unknown>).address,
          );
          if (itemAddress === address) {
            return {
              ...item,
              deleted: newDeletedState,
            } as TItem;
          }
          return item;
        });

        setPageData((prev: TPageData | null) => {
          if (!prev) return prev;
          return new pageClass({
            ...prev,
            [itemsProperty]: optimisticValues,
          }) as TPageData;
        });

        crudFunc(createPayload(currentDataFacet, address), operation, {
          ...updateItem,
          address,
        } as TItem)
          .then(() => {
            // Success handled by visual state change
            if (debug) {
              const action = newDeletedState ? 'delete' : 'undelete';
              emitSuccess(action as 'delete' | 'undelete', address);
            }
          })
          .catch((err: unknown) => {
            handleError(err, `Failed to toggle delete for ${address}`);
            setPageData((prev: TPageData | null) => {
              if (!prev) return prev;
              return new pageClass({
                ...prev,
                [itemsProperty]: original,
              }) as TPageData;
            });
          });
      } catch (err: unknown) {
        handleError(err, `Error in handleToggle for ${address}`);
      }
    },
    [
      pageData,
      itemsProperty,
      setPageData,
      pageClass,
      crudFunc,
      createPayload,
      updateItem,
      collection,
      currentDataFacet,
      clearError,
      handleError,
      emitSuccess,
    ],
  );
  const handleToggle = useCallback(
    (address: string) => {
      performToggle(address);
    },
    [performToggle],
  );

  const performRemove = useCallback(
    (address: string) => {
      clearError();

      try {
        const items = pageData
          ? (pageData as Record<string, unknown>)[itemsProperty]
          : null;
        if (!Array.isArray(items)) {
          handleError(
            new Error(`No valid items array found for ${collection}`),
            `handleRemove for ${address}`,
          );
          return;
        }
        const original = [...(items as TItem[])];
        const isOnlyRowOnPage = original.length === 1;

        const optimisticValues = original.filter((item: TItem) => {
          const itemAddress = addressToHex(
            (item as Record<string, unknown>).address,
          );
          return itemAddress !== address;
        });

        setPageData((prev: TPageData | null) => {
          if (!prev) return prev;
          return new pageClass({
            ...prev,
            [itemsProperty]: optimisticValues,
          }) as TPageData;
        });

        crudFunc(
          createPayload(currentDataFacet, address),
          crud.Operation.REMOVE,
          { ...updateItem, address } as TItem,
        )
          .then(async () => {
            const result = await pageFunc(
              createPayload(currentDataFacet),
              pagination.currentPage * pagination.pageSize,
              pagination.pageSize,
              sort,
              filter,
            );

            // If we deleted the only row on the page, navigate to end of table
            if (isOnlyRowOnPage && result.totalItems > 0) {
              const totalPages = Math.ceil(
                result.totalItems / pagination.pageSize,
              );

              if (pagination.currentPage >= totalPages) {
                const targetPage = Math.max(0, totalPages - 1);
                const lastRowIndex =
                  (result.totalItems - 1) % pagination.pageSize;

                goToPage(targetPage);

                // Set pending row action to select the last row after page navigation
                // NOTE: rowIndex should be the row within the page, not global
                const pendingAction = types.RowActionPayload.createFrom({
                  collection,
                  dataFacet: getCurrentDataFacet(),
                  rowAction: types.RowActionConfig.createFrom({
                    type: 'navigate',
                    target: types.NavigationTarget.createFrom({
                      view: viewStateKey.viewName,
                      facet: viewStateKey.facetName,
                      rowIndex: lastRowIndex, // This is row index within the target page
                    }),
                  }),
                });

                setPendingRowAction(viewStateKey, pendingAction);
              }
            }

            setPageData(result);
            setTotalItems(result.totalItems || 0);

            if (debug) {
              emitSuccess('remove', address);
            }
          })
          .catch((err: unknown) => {
            handleError(err, `Failed to remove ${address}`);
            setPageData((prev: TPageData | null) => {
              if (!prev) return prev;
              return new pageClass({
                ...prev,
                [itemsProperty]: original,
              }) as TPageData;
            });
          });
      } catch (err: unknown) {
        handleError(err, `Error in handleRemove for ${address}`);
      }
    },
    [
      pageData,
      itemsProperty,
      setPageData,
      pageClass,
      crudFunc,
      createPayload,
      updateItem,
      pageFunc,
      pagination,
      sort,
      filter,
      setTotalItems,
      goToPage,
      collection,
      currentDataFacet,
      clearError,
      handleError,
      emitSuccess,
      getCurrentDataFacet,
      setPendingRowAction,
      viewStateKey,
    ],
  );
  const handleRemove = useCallback(
    (address: string) => {
      let message = 'Permanently remove this item?';
      if (collection === 'abis') {
        const displayAddress = getDisplayAddress(address);
        message = `Remove downloaded ABI for address ${displayAddress}?`;
      }

      askConfirmOrExecute({
        title: 'Confirm Remove',
        message,
        dialogKey: 'confirm.remove',
        onConfirm: () => performRemove(address),
      });
    },
    [askConfirmOrExecute, performRemove, collection],
  );

  const performAutoname = useCallback(
    (address: string) => {
      clearError();

      try {
        const items = pageData
          ? (pageData as Record<string, unknown>)[itemsProperty]
          : null;
        if (!Array.isArray(items)) {
          handleError(
            new Error(`No valid items array found for ${collection}`),
            `handleAutoname for ${address}`,
          );
          return;
        }
        const original = [...(items as TItem[])];

        const optimisticValues = original.map((item: TItem) => {
          const itemAddress = addressToHex(
            (item as Record<string, unknown>).address,
          );
          if (itemAddress === address) {
            return {
              ...item,
              name: 'Generating...',
            } as TItem;
          }
          return item;
        });

        setPageData((prev: TPageData | null) => {
          if (!prev) return prev;
          return new pageClass({
            ...prev,
            [itemsProperty]: optimisticValues,
          }) as TPageData;
        });

        crudFunc(
          createPayload(currentDataFacet, address),
          crud.Operation.AUTONAME,
          { ...updateItem, address } as TItem,
        )
          .then(async () => {
            // Refresh to get the actual generated name
            const result = await pageFunc(
              createPayload(currentDataFacet),
              pagination.currentPage * pagination.pageSize,
              pagination.pageSize,
              sort,
              filter,
            );
            setPageData(result);
            setTotalItems(result.totalItems || 0);
            if (debug) {
              emitSuccess('autoname', address);
            }
          })
          .catch((err: unknown) => {
            handleError(err, `Failed to auto-name ${address}`);
            setPageData((prev: TPageData | null) => {
              if (!prev) return prev;
              return new pageClass({
                ...prev,
                [itemsProperty]: original,
              }) as TPageData;
            });
          });
      } catch (err: unknown) {
        handleError(err, `Error in handleAutoname for ${address}`);
      }
    },
    [
      pageData,
      itemsProperty,
      setPageData,
      pageClass,
      crudFunc,
      createPayload,
      updateItem,
      pageFunc,
      pagination,
      sort,
      filter,
      setTotalItems,
      collection,
      currentDataFacet,
      clearError,
      handleError,
      emitSuccess,
    ],
  );
  const handleAutoname = useCallback(
    (address: string) => {
      performAutoname(address);
    },
    [performAutoname],
  );

  const handleUpdate = useCallback(
    (data: Record<string, unknown>) => {
      const item = data as unknown as TItem;
      const addressStr = addressToHex(
        (item as Record<string, unknown>).address,
      );

      clearError();

      try {
        const processedItem = postFunc ? postFunc({ ...item }) : { ...item };

        const items = pageData
          ? (pageData as Record<string, unknown>)[itemsProperty]
          : null;
        if (!Array.isArray(items)) {
          handleError(
            new Error(`No valid items array found for ${collection}`),
            `handleUpdate for ${addressStr}`,
          );
          return;
        }
        const original = [...(items as TItem[])];

        // Optimistic UI Update
        let optimisticValues: TItem[];
        const existingItemIndex = original.findIndex((originalItem: TItem) => {
          const itemAddress = addressToHex(
            (originalItem as Record<string, unknown>).address,
          );
          return itemAddress === addressStr;
        });

        if (existingItemIndex !== -1) {
          optimisticValues = [...original];
          optimisticValues[existingItemIndex] = processedItem as TItem;
        } else {
          optimisticValues = [processedItem as TItem, ...original];
        }

        setPageData((prev: TPageData | null) => {
          if (!prev) return prev;
          return new pageClass({
            ...prev,
            [itemsProperty]: optimisticValues,
          }) as TPageData;
        });

        crudFunc(
          createPayload(currentDataFacet, addressStr),
          crud.Operation.UPDATE,
          processedItem as TItem,
        )
          .then(() => {
            // Success handled by visual state change
            if (debug) {
              emitSuccess('update', addressStr);
            }
          })
          .catch((err: unknown) => {
            setPageData((prev: TPageData | null) => {
              if (!prev) return prev;
              return new pageClass({
                ...prev,
                [itemsProperty]: original,
              }) as TPageData;
            });
            handleError(err, `Failed to update ${addressStr}`);
          });
      } catch (err: unknown) {
        handleError(err, `Error in handleUpdate for ${addressStr}`);
      }
    },
    [
      pageData,
      itemsProperty,
      setPageData,
      pageClass,
      crudFunc,
      createPayload,
      postFunc,
      collection,
      currentDataFacet,
      clearError,
      handleError,
      emitSuccess,
    ],
  );

  const performClean = useCallback(async () => {
    if (!cleanFunc) return;

    clearError();

    try {
      await cleanFunc(createPayload(currentDataFacet), []);
      const result = await pageFunc(
        createPayload(currentDataFacet),
        pagination.currentPage * pagination.pageSize,
        pagination.pageSize,
        sort,
        filter,
      );
      setPageData(result);
      setTotalItems(result.totalItems || 0);
      if (debug) {
        emitSuccess('clean');
      }
    } catch (err: unknown) {
      handleError(err, `Failed to clean ${collection}`);
    }
  }, [
    cleanFunc,
    clearError,
    createPayload,
    currentDataFacet,
    pageFunc,
    pagination.currentPage,
    pagination.pageSize,
    sort,
    filter,
    setPageData,
    setTotalItems,
    handleError,
    collection,
    emitSuccess,
  ]);
  const handleClean = useCallback(() => {
    if (!cleanFunc) return;
    askConfirmOrExecute({
      title: 'Confirm Clean',
      message: 'This will clean cached data. Continue?',
      dialogKey: 'confirm.clean',
      onConfirm: () => {
        void performClean();
      },
    });
  }, [askConfirmOrExecute, cleanFunc, performClean]);

  // TODO: Implement handleCleanOne if needed for cleaning specific addresses
  // const handleCleanOne = useCallback(
  //   async (addresses: string[]) => {
  //     if (!cleanFunc) return;
  //
  //     clearError();
  //     const firstAddress = addresses.length > 0 ? addresses[0] : null;
  //     const processingKey = firstAddress || 'clean-one';
  //     actionConfig.startProcessing(processingKey);
  //
  //     try {
  //       // Emit cleaning status
  //       if (collection === 'monitors') {
  //         emitStatus(`Cleaning ${addresses.length} monitor(s)...`);
  //       }
  //       await cleanFunc(createPayload(dataFacetRef.current), addresses);
  //       const result = await pageFunc(
  //         createPayload(dataFacetRef.current),
  //         pagination.currentPage * pagination.pageSize,
  //         pagination.pageSize,
  //         sort,
  //         filter,
  //       );
  //       setPageData(result);
  //       setTotalItems(result.totalItems || 0);
  //       emitSuccess('clean', addresses.length);
  //     } catch (err: unknown) {
  //       const errorMessage = err instanceof Error ? err.message : String(err);
  //       handleError(err, failure('clean', undefined, errorMessage));
  //     } finally {
  //       setTimeout(() => {
  //         actionConfig.stopProcessing(processingKey);
  //       }, 100);
  //     }
  //   },
  //   [
  //     cleanFunc,
  //     clearError,
  //     collection,
  //     createPayload,
  //     dataFacetRef,
  //     pageFunc,
  //     pagination.currentPage,
  //     pagination.pageSize,
  //     sort,
  //     filter,
  //     setPageData,
  //     setTotalItems,
  //     emitSuccess,
  //     handleError,
  //     failure,
  //     emitStatus,
  //     actionConfig,
  //   ],
  // );

  // Handle row action (Enter key on table rows)
  const handleRowAction = useCallback(
    async (rowData: Record<string, unknown>) => {
      try {
        // Get the row action configuration for the current facet
        const facetKey = currentDataFacet as unknown as string;
        const facetConfig = viewConfig?.facets?.[facetKey];
        const rowActionConfig = facetConfig?.rowAction;

        if (!rowActionConfig) {
          LogError(`No row action configured for facet: ${facetKey}`);
          return;
        }

        const payload = types.RowActionPayload.createFrom({
          collection: config.collection,
          dataFacet: currentDataFacet,
          rowData,
          rowAction: rowActionConfig,
        });

        await ExecuteRowAction(payload);
      } catch (error) {
        LogError(`Error executing row action: ${String(error)}`);
      }
    },
    [config.collection, currentDataFacet, viewConfig],
  );

  // Map action types to handlers
  const handlers = useMemo(
    () => ({
      handleCreate,
      handleExport,
      handlePublish,
      handlePin,
      handleToggle,
      handleRemove,
      handleAutoname,
      handleUpdate,
      handleClean,
      handleSpeak,
      handleRowAction,
    }),
    [
      handleCreate,
      handleExport,
      handlePublish,
      handlePin,
      handleToggle,
      handleRemove,
      handleAutoname,
      handleUpdate,
      handleClean,
      handleSpeak,
      handleRowAction,
      // TODO: Add handleCleanOne when implemented
      // handleCleanOne,
    ],
  );

  return {
    handlers,
    config: {
      headerActions,
      rowActions,
      collection,
      getCurrentDataFacet,
      isWalletConnected,
    },
    confirmModal: {
      ...confirmModal,
      onClose: closeConfirm,
      onConfirm: () => {
        if (confirmModal.onConfirm) confirmModal.onConfirm();
        closeConfirm();
      },
    },
    transactionModal: {
      ...transactionModal,
      onClose: () =>
        setTransactionModal((prev) => ({ ...prev, opened: false })),
      onConfirm: async () => {
        setTransactionModal((prev) => ({ ...prev, opened: false }));
      },
    },
    exportFormatModal: {
      ...exportFormatModal,
      onClose: handleExportFormatModalClose,
      onFormatSelected: handleFormatSelected,
    },
  };
};
