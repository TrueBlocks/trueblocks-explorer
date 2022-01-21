import * as ApiCallers from "../lib/api_callers";
import { PinnedChunk, Manifest } from "../types";

export function getPins(
  parameters?: {
    list?: boolean,
    init?: boolean,
    all?: boolean,
    share?: boolean,
    sleep?: number,
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
  return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/pins', method: 'get', parameters, options });
}
