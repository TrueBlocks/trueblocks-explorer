import { useEffect, useRef } from 'react';

import { EventsOn } from '@runtime';

export const useEvent = function <T = unknown>(
  eventType: string,
  callback: (message: string, payload?: T) => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    // Wrapper to handle Wails event arguments properly
    const wrappedCallback = (...args: unknown[]) => {
      const message = (args[0] as string) || '';
      const payload = args[1] as T | undefined;
      callbackRef.current(message, payload);
    };

    const unsubscribe = EventsOn(eventType, wrappedCallback);
    return () => {
      unsubscribe();
    };
  }, [eventType]);
};
