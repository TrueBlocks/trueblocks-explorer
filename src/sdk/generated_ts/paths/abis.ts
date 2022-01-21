import * as ApiCallers from "../lib/api_callers";
import { address, Function } from "../types";

export function getAbis(
  parameters?: {
    addrs: address[],
    sol?: boolean,
    find?: string[],
    known?: boolean,
    source?: boolean,
    logLevel?: number,
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
  return ApiCallers.fetch<Function[]>({ endpoint: '/abis', method: 'get', parameters, options });
}
