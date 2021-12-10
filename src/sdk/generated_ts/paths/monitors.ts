import * as ApiCallers from "../lib/api_callers";
import { address, Monitor } from "../types";

export function getMonitors(
  parameters: {
    addrs: address[],
    appearances?: boolean,
    count?: boolean,
    clean?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Monitor[]>({ endpoint: '/monitors', method: 'get', parameters, options });
}
