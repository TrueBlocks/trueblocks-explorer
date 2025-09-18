import { useCallback, useMemo, useState } from 'react';

interface ConfirmConfig {
  action: string;
  title: string;
  message: string;
  dialogKey: string;
  afterConfirm?: () => void;
}

interface UseConfirmableActionsParams<
  THandlers extends Record<string, (...args: unknown[]) => void>,
> {
  handlers: THandlers;
  confirmMap: Partial<Record<keyof THandlers, ConfirmConfig>>;
}

export const useConfirmableActions = <
  THandlers extends Record<string, (...args: unknown[]) => void>,
>({
  handlers,
  confirmMap,
}: UseConfirmableActionsParams<THandlers>) => {
  const [state, setState] = useState<{
    opened: boolean;
    onConfirm: () => void;
    title: string;
    message: string;
    dialogKey: string;
  }>({
    opened: false,
    onConfirm: () => {},
    title: '',
    message: '',
    dialogKey: '',
  });

  const wrap = useCallback(
    <K extends keyof THandlers>(key: K): THandlers[K] => {
      const handler = handlers[key];
      const confirmCfg = confirmMap[key];
      if (!confirmCfg) return handler;
      return ((...args: unknown[]) => {
        setState({
          opened: true,
          onConfirm: () => {
            if (handler) {
              handler(...(args as Parameters<THandlers[K]>));
            }
            if (confirmCfg.afterConfirm) confirmCfg.afterConfirm();
          },
          title: confirmCfg.title,
          message: confirmCfg.message,
          dialogKey: confirmCfg.dialogKey,
        });
      }) as THandlers[K];
    },
    [handlers, confirmMap],
  );

  const wrappedHandlers = useMemo(() => {
    return Object.keys(handlers).reduce((acc, key) => {
      acc[key as keyof THandlers] = wrap(key as keyof THandlers);
      return acc;
    }, {} as THandlers);
  }, [handlers, wrap]);

  const close = useCallback(
    () => setState((p) => ({ ...p, opened: false })),
    [],
  );

  return {
    handlers: wrappedHandlers,
    confirmState: state,
    closeConfirm: close,
  };
};
