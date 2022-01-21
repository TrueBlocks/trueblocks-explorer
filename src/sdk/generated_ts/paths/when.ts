import * as ApiCallers from "../lib/api_callers";
import { DatedBlock } from "../types";

export function getWhen(
  parameters?: {
    timestamps?: boolean,
    list?: boolean,
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
  return ApiCallers.fetch<DatedBlock[]>({ endpoint: '/when', method: 'get', parameters, options });
}
