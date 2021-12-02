import * as ApiCallers from "../lib/api_callers";
import { address, blknum, Token } from "../types";

export function getTokens(
    parameters: {
        addrs2: address[],
        blocks?: blknum[],
        parts?: string[],
        byAcct?: boolean,
        noZero?: boolean,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<Token[]>({ endpoint: '/tokens', method: 'get', parameters, options });
}