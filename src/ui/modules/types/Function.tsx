import { ParameterArray } from '@modules/types';

export type Function = {
  name: string;
  type: string;
  abi_source: string;
  anonymous: boolean;
  constant: boolean;
  stateMutability: string;
  signature: string;
  encoding: string;
  message: string;
  inputs: ParameterArray;
  outputs: ParameterArray;
  inputs_dict: string;
  outputs_dict: string;
};
export type FunctionArray = Function[];
