import * as ApiCallers from "../lib/api_callers";
import { Status, Cache } from "../types";

export function getStatus(
  parameters?: {
    modes?: string[],
    details?: boolean,
    terse?: boolean,
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
  return ApiCallers.fetch<Status[] | Cache[]>({ endpoint: '/status', method: 'get', parameters, options });
}
