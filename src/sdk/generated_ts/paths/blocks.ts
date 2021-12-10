import * as ApiCallers from "../lib/api_callers";
import { blknum, address, topic, Block } from "../types";

export function getBlocks(
  parameters: {
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
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Block[]>({ endpoint: '/blocks', method: 'get', parameters, options });
}
