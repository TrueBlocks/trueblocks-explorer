import { address, FunctionArray } from '@modules/types';

export type Abi = {
  address: address;
  interfaces: FunctionArray;
};
export type AbiArray = Abi[];
