import { msgs } from '@models';
import { EventsEmit } from '@runtime';

export const emitEvent = (
  eventType: string,
  message: string,
  data?: unknown,
) => {
  EventsEmit(eventType, message, data);
};

export const emitStatus = (msg: string) => {
  emitEvent(msgs.EventType.STATUS, msg);
};

export const emitError = (msg: string) => {
  emitEvent(msgs.EventType.ERROR, msg);
};

export const emitManager = (msg: string) => {
  emitEvent(msgs.EventType.MANAGER, msg);
};
