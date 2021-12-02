import * as ApiCallers from "../lib/api_callers";
import { tx_id, Receipt } from "../types";

export function getReceipts(
    parameters: {
        transactions: tx_id[],
        articulate?: boolean,
    },
    options?: RequestInit
) {
    return ApiCallers.fetch<Receipt[]>({ endpoint: '/receipts', method: 'get', parameters, options });
}