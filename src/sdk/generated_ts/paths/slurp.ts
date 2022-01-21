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
  return ApiCallers.fetch<Transaction[]>({ endpoint: '/slurp', method: 'get', parameters, options });
}
