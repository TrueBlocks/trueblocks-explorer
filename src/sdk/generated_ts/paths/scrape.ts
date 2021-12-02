import * as ApiCallers from "../lib/api_callers";
import { PinnedChunk, Manifest } from "../types";

export function getScrape(
    parameters: {
        modes: string[],
        action?: string,
        sleep?: number,
        pin?: boolean,
        publish?: boolean,
        blockCnt?: number,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/scrape', method: 'get', parameters, options });
}