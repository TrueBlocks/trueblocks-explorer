import * as ApiCallers from "../lib/api_callers";
import { address, blknum, Token } from "../types";

export function getTokens(
  parameters?: {
    addrs2: address[],
    blocks?: blknum[],
    parts?: string[],
    byAcct?: boolean,
    noZero?: boolean,
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
  return ApiCallers.fetch<Token[]>({ endpoint: '/tokens', method: 'get', parameters, options });
}
