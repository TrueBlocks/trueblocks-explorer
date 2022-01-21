import * as ApiCallers from "../lib/api_callers";
import { Status, Cache } from "../types";

export function getStatus(
  parameters?: {
    modes?: string[],
    details?: boolean,
    terse?: boolean,
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
  return ApiCallers.fetch<Status[] | Cache[]>({ endpoint: '/status', method: 'get', parameters, options });
}
