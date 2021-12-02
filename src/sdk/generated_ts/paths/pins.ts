import * as ApiCallers from "../lib/api_callers";
import { PinnedChunk, Manifest } from "../types";

export function getPins(
    parameters: {
        list?: boolean,
        init?: boolean,
        all?: boolean,
        share?: boolean,
        sleep?: number,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/pins', method: 'get', parameters, options });
}