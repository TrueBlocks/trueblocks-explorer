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
  return ApiCallers.fetch<Function[]>({ endpoint: '/abis', method: 'get', parameters, options });
}
