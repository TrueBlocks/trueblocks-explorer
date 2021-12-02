import * as ApiCallers from "../lib/api_callers";
import { DatedBlock } from "../types";

export function getWhen(
    parameters: {
        timestamps?: boolean,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<DatedBlock[]>({ endpoint: '/when', method: 'get', parameters, options });
}