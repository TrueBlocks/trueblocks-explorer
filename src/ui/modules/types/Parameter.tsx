import { uint64 } from '@modules/types';

export type Parameter = {
  type: string;
  name: string;
  str_default: string;
  value: string;
  indexed: boolean;
  internalType: string;
  components: string;
  no_write: boolean;
  is_flags: uint64;
  precision: uint64;
};
export type ParameterArray = Parameter[];
