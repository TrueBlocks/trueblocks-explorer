import { useMemo } from 'react';

import { msgs } from '@models';
import { EventsEmit } from '@runtime';

export const emitEvent = (
  eventType: string,
  message: string,
  data?: unknown,
) => {
  EventsEmit(eventType, message, data);
};

const createEventEmitters = () => {
  return {
    emitStatus: (msg: string) => emitEvent(msgs.EventType.STATUS, msg),
    emitError: (msg: string) => emitEvent(msgs.EventType.ERROR, msg),
    emitManager: (msg: string) => emitEvent(msgs.EventType.MANAGER, msg),
  };
};

export const useEmitters = (): ReturnType<typeof createEventEmitters> => {
  return useMemo(() => createEventEmitters(), []);
};
