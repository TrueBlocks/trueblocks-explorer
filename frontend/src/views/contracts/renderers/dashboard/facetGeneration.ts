import { types } from '@models';

export const getReadFunctions = (abi: types.Abi): types.Function[] => {
  return abi.functions.filter(
    (func) =>
      func.type === 'function' &&
      (func.stateMutability === 'view' ||
        func.stateMutability === 'pure' ||
        !func.stateMutability), // Default to view when not specified
  );
};

export const getWriteFunctions = (abi: types.Abi): types.Function[] => {
  return abi.functions.filter(
    (func) =>
      func.type === 'function' &&
      (func.stateMutability === 'nonpayable' ||
        func.stateMutability === 'payable'),
  );
};
