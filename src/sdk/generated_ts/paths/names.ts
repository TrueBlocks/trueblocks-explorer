import * as ApiCallers from "../lib/api_callers";
import { Name } from "../types";

export function getNames(
    parameters: {
        terms: string[],
        expand?: boolean,
        matchCase?: boolean,
        all?: boolean,
        custom?: boolean,
        prefund?: boolean,
        named?: boolean,
        addr?: boolean,
        collections?: boolean,
        tags?: boolean,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<Name[]>({ endpoint: '/names', method: 'get', parameters, options });
}