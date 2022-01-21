import * as ApiCallers from "../lib/api_callers";
import { address, Appearance, ListStats } from "../types";

export function getList(
  parameters?: {
    addrs: address[],
    count?: boolean,
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
  return ApiCallers.fetch<Appearance[] | ListStats[]>({ endpoint: '/list', method: 'get', parameters, options });
}
