import * as ApiCallers from "../lib/api_callers";
import { PinnedChunk, Manifest } from "../types";

export function getInit(
  parameters?: {
    all?: boolean,
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
  return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/init', method: 'get', parameters, options });
}
