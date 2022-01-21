import * as ApiCallers from "../lib/api_callers";
import { tx_id, Transaction } from "../types";

export function getTransactions(
  parameters?: {
    transactions: tx_id[],
    articulate?: boolean,
    trace?: boolean,
    uniq?: boolean,
    reconcile?: string,
    cache?: boolean,
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
  return ApiCallers.fetch<Transaction[]>({ endpoint: '/transactions', method: 'get', parameters, options });
}
