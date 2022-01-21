import * as ApiCallers from "../lib/api_callers";
import { address, blknum, Transaction } from "../types";

export function getSlurp(
  parameters?: {
    addrs: address[],
    blocks?: blknum[],
    types?: string[],
    appearances?: boolean,
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
  return ApiCallers.fetch<Transaction[]>({ endpoint: '/slurp', method: 'get', parameters, options });
}
