import * as ApiCallers from "../lib/api_callers";
import { Quote } from "../types";

export function getQuotes(
  parameters?: {
    period?: 5 | 15 | 30 | 60 | 120 | 240 | 1440 | 10080 | 'hourly' | 'daily' | 'weekly',
    pair?: string,
    feed?: 'poloniex' | 'maker' | 'tellor',
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
  return ApiCallers.fetch<Quote[]>({ endpoint: '/quotes', method: 'get', parameters, options });
}
