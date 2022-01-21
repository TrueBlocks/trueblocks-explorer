import * as ApiCallers from "../lib/api_callers";
import { address, Monitor } from "../types";

export function getMonitors(
  parameters?: {
    addrs: address[],
    appearances?: boolean,
    count?: boolean,
    clean?: boolean,
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
  return ApiCallers.fetch<Monitor[]>({ endpoint: '/monitors', method: 'get', parameters, options });
}
