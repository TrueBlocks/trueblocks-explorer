import * as ApiCallers from "../lib/api_callers";
import { blknum, address, topic, Block } from "../types";

export function getBlocks(
  parameters?: {
    blocks: blknum[],
    hashes?: boolean,
    uncles?: boolean,
    trace?: boolean,
    apps?: boolean,
    uniq?: boolean,
    logs?: boolean,
    emitter?: address[],
    topic?: topic[],
    count?: boolean,
    cache?: boolean,
    list?: blknum,
    listCount?: blknum,
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
  return ApiCallers.fetch<Block[]>({ endpoint: '/blocks', method: 'get', parameters, options });
}
