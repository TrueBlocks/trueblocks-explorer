import * as ApiCallers from "../lib/api_callers";
import { address, Abi } from "../types";

export function getAbis(
    parameters: {
        addrs: address[],
        sol?: boolean,
        find?: string[],
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<Abi[]>({ endpoint: '/abis', method: 'get', parameters, options });
}