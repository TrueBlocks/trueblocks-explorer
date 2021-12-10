import * as ApiCallers from "../lib/api_callers";
import { tx_id, Log } from "../types";

export function getLogs(
  parameters: {
    transactions: tx_id[],
    articulate?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Log[]>({ endpoint: '/logs', method: 'get', parameters, options });
}
