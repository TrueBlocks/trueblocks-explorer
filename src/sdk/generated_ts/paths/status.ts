import * as ApiCallers from "../lib/api_callers";
import { Status, Cache } from "../types";

export function getStatus(
    parameters: {
        modes?: string[],
        details?: boolean,
        terse?: boolean,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<Status[] | Cache[]>({ endpoint: '/status', method: 'get', parameters, options });
}