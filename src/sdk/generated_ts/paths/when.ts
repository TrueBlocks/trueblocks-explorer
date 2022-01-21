import * as ApiCallers from "../lib/api_callers";
import { DatedBlock } from "../types";

export function getWhen(
  parameters?: {
    timestamps?: boolean,
    list?: boolean,
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
  return ApiCallers.fetch<DatedBlock[]>({ endpoint: '/when', method: 'get', parameters, options });
}
