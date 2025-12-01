import { useCallback } from 'react';

import { CancelFetches } from '@app';
import { LogError, emitStatus } from '@utils';
import { useHotkeys } from 'react-hotkeys-hook';

interface UseGlobalEscapeProps {
  enabled?: boolean;
  onEscape?: () => void;
}

/**
 * Global escape key handler that cancels all active fetches
 * and optionally runs a custom callback
 */
export const useGlobalEscape = ({
  enabled = true,
  onEscape,
}: UseGlobalEscapeProps = {}) => {
  const handleEscape = useCallback(async () => {
    try {
      const cancelledCount = await CancelFetches();
      if (cancelledCount > 0) {
        emitStatus(
          `Cancelled ${cancelledCount} active fetch${cancelledCount === 1 ? '' : 'es'}`,
        );
      }
      onEscape?.();
    } catch (error) {
      LogError('Failed to cancel fetches:', JSON.stringify(error));
      emitStatus('Failed to cancel active fetches');
    }
  }, [onEscape]);

  useHotkeys(
    'esc',
    (e) => {
      e.preventDefault();
      handleEscape();
    },
    {
      enableOnFormTags: true,
      enabled,
    },
  );

  return { cancelAllFetches: handleEscape };
};
