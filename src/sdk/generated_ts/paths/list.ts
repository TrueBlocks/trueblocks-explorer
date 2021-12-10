import * as ApiCallers from "../lib/api_callers";
import { address, Appearance } from "../types";

export function getList(
  parameters: {
    addrs: address[],
    count?: boolean,
    appearances?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Appearance[]>({ endpoint: '/list', method: 'get', parameters, options });
}
