import * as ApiCallers from "../lib/api_callers";
import { Quote } from "../types";

export function getQuotes(
    parameters: {
        period?: string,
        pair?: string,
        feed?: string,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<Quote[]>({ endpoint: '/quotes', method: 'get', parameters, options });
}