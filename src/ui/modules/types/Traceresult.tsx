import { address, gas } from '@modules/types';

export type Traceresult = {
  newContract: address;
  code: string;
  gasUsed: gas;
  output: string;
};
export type TraceresultArray = Traceresult[];
