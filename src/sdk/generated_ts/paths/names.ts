import * as ApiCallers from "../lib/api_callers";
import { Name } from "../types";

export function getNames(
  parameters?: {
    terms: string[],
    expand?: boolean,
    matchCase?: boolean,
    all?: boolean,
    custom?: boolean,
    prefund?: boolean,
    named?: boolean,
    addr?: boolean,
    collections?: boolean,
    tags?: boolean,
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
  return ApiCallers.fetch<Name[]>({ endpoint: '/names', method: 'get', parameters, options });
}
