import * as ApiCallers from "../lib/api_callers";
import { blknum, PinnedChunk, Manifest } from "../types";

export function getChunks(
  parameters?: {
    blocks?: blknum[],
    check?: boolean,
    extract?: 'header' | 'addr_table' | 'app_table' | 'chunks' | 'blooms',
    stats?: boolean,
    save?: boolean,
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
  return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/chunks', method: 'get', parameters, options });
}
