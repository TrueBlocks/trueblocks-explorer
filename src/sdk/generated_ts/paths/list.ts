import * as ApiCallers from "../lib/api_callers";
import { address, Appearance, ListStats } from "../types";

export function getList(
  parameters?: {
    addrs: address[],
    count?: boolean,
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
  return ApiCallers.fetch<Appearance[] | ListStats[]>({ endpoint: '/list', method: 'get', parameters, options });
}
