import { AnyResponse, ErrorResponse, SuccessResponse } from '@sdk';

export type CallPending = {
  type: 'pending',
} & CallStatusBase;

export type CallError = {
  type: 'error',
} & CallStatusBase & ErrorResponse;

export type CallSuccess<Resource> = {
  type: 'success',
} & CallStatusBase & SuccessResponse<Resource>;

export type CallStatusBase = {
  loading: boolean,
  initiated: boolean,
};

export type CallStatus<Resource> =
  | CallPending
  | CallError
  | CallSuccess<Resource>;

export function createPendingCall<T>(): CallStatus<T> {
  return {
    type: 'pending',
    loading: false,
    initiated: false,
  };
}

export function wrapResponse<T>(response: AnyResponse<T>): CallStatus<T> {
  const partial = {
    loading: false,
    initiated: true,
  };

  if ('errors' in response) {
    return {
      type: 'error',
      ...response,
      ...partial,
    };
  }

  return {
    type: 'success',
    ...response,
    ...partial,
  };
}

export function isFailedCall(cs: CallStatus<unknown>): cs is CallError {
  return cs.type === 'error';
}

export function isSuccessfulCall(cs: CallStatus<unknown>): cs is CallSuccess<unknown> {
  return cs.type === 'success';
}

export function isPendingCall(cs: CallStatus<unknown>): cs is CallPending {
  return cs.type === 'pending';
}
