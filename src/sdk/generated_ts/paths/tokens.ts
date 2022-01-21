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
    loglevel?: number,
    noheader?: boolean,
    chain?: string,
    wei?: boolean,
    ether?: boolean,
    dollars?: boolean,
    help?: boolean,
    raw?: boolean,
    tofile?: boolean,
    file?: string,
    version?: boolean,
    noop?: boolean,
    mocked?: boolean,
    nocolor?: boolean,
    outputfn?: string,
    format?: string,
    testmode?: boolean,
    apimode?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Token[]>({ endpoint: '/tokens', method: 'get', parameters, options });
}
