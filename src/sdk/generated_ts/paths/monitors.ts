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
  return ApiCallers.fetch<Monitor[]>({ endpoint: '/monitors', method: 'get', parameters, options });
}
