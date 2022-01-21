import * as ApiCallers from "../lib/api_callers";
import { tx_id, Log } from "../types";

export function getLogs(
  parameters?: {
    transactions: tx_id[],
    articulate?: boolean,
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
  return ApiCallers.fetch<Log[]>({ endpoint: '/logs', method: 'get', parameters, options });
}
