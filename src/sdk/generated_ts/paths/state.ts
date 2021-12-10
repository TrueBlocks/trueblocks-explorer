import * as ApiCallers from "../lib/api_callers";
import { address, blknum, State, Result } from "../types";

export function getState(
  parameters: {
    addrs: address[],
    blocks?: blknum[],
    parts?: string[],
    changes?: boolean,
    noZero?: boolean,
    call?: string,
    proxyFor?: string,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<State[] | Result[]>({ endpoint: '/state', method: 'get', parameters, options });
}
