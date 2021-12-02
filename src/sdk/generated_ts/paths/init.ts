import * as ApiCallers from "../lib/api_callers";
import { PinnedChunk, Manifest } from "../types";

export function getInit(
    parameters: {
        all?: boolean,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/init', method: 'get', parameters, options });
}