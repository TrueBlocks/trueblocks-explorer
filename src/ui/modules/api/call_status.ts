import { AnyResponse, ErrorResponse, SuccessResponse } from '@sdk';

// CallStatus<T> holds information about an API call: has it been initialized,
// is pending, failed (if yes then the error is also present) or successful (and
// the returned data of type T)
export type CallStatus<Resource> =
  | CallPending
  | CallError
  | CallSuccess<Resource>;

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

// Creates a pending call. Usefull when initializing values
export function createPendingCall<Resource>(): CallStatus<Resource> {
  return {
    type: 'pending',
    loading: false,
    initiated: false,
  };
}

// Creates a new CallStatus with the data or error contained in response.
// This is usefull if we already have the response, but will need the call
// information later on (e.g. for subsequent requests).
export function wrapResponse<Resource>(response: AnyResponse<Resource>): CallStatus<Resource> {
  const base = {
    loading: false,
    initiated: true,
  };

  if ('errors' in response) {
    return {
      type: 'error',
      ...response,
      ...base,
    };
  }

  return {
    type: 'success',
    ...response,
    ...base,
  };
}

// Type guards help to ensure that all required properties are defined
export function isFailedCall(cs: CallStatus<unknown>): cs is CallError {
  return cs.type === 'error';
}

export function isSuccessfulCall(cs: CallStatus<unknown>): cs is CallSuccess<unknown> {
  return cs.type === 'success';
}

export function isPendingCall(cs: CallStatus<unknown>): cs is CallPending {
  return cs.type === 'pending';
}
