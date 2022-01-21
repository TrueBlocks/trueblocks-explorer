import * as ApiCallers from "../lib/api_callers";
import { address, blknum, State, Result } from "../types";

export function getState(
  parameters?: {
    addrs: address[],
    blocks?: blknum[],
    parts?: string[],
    changes?: boolean,
    noZero?: boolean,
    call?: string,
    proxyFor?: string,
    fmt?: string,
    verbose?: boolean,
    logLevel?: number,
    noHeader?: boolean,
    chain?: string,
    wei?: boolean,
    ether?: boolean,
    dollars?: boolean,
    help?: boolean,
    raw?: boolean,
    toFile?: boolean,
    file?: string,
    version?: boolean,
    noop?: boolean,
    mocked?: boolean,
    noColor?: boolean,
    outputFn?: string,
    format?: string,
    testMode?: boolean,
    apiMode?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<State[] | Result[]>({ endpoint: '/state', method: 'get', parameters, options });
}
