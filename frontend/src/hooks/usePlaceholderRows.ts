import { useCallback, useEffect, useRef, useState } from 'react';

import { types } from '@models';

interface UsePlaceholderRowsProps {
  data?: unknown[];
  state: types.StoreState;
}

export const usePlaceholderRows = ({
  data,
  state,
}: UsePlaceholderRowsProps) => {
  const [placeholderCount, setPlaceholderCount] = useState(0);
  const [cyclingRowIndex, setCyclingRowIndex] = useState(0);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    clearAllTimers();

    if (data && data.length > 0) {
      setPlaceholderCount(0);
      setCyclingRowIndex(0);
      return;
    }

    if (state === types.StoreState.FETCHING) {
      // Start with a 2-second delay
      const delayTimer = setTimeout(() => {
        let currentCount = 0;
        const maxRows = 6;

        const addRow = () => {
          if (currentCount < maxRows) {
            currentCount++;
            setPlaceholderCount(currentCount);

            if (currentCount < maxRows) {
              // Schedule next row addition
              const nextRowTimer = setTimeout(addRow, 1000);
              timersRef.current.add(nextRowTimer);
            } else {
              // Start cycling through rows
              let cycleIndex = 0;
              setCyclingRowIndex(0);

              const cycleRows = () => {
                cycleIndex = (cycleIndex + 1) % maxRows;
                setCyclingRowIndex(cycleIndex);
              };

              const cycleTimer = setInterval(cycleRows, 1000);
              timersRef.current.add(
                cycleTimer as unknown as ReturnType<typeof setTimeout>,
              );
            }
          }
        };

        // Start adding rows
        addRow();
      }, 2000);

      timersRef.current.add(delayTimer);
    } else {
      setPlaceholderCount(0);
      setCyclingRowIndex(0);
    }

    return clearAllTimers;
  }, [data, state, clearAllTimers]);

  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  return { placeholderCount, cyclingRowIndex };
};
