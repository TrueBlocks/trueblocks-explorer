import { uint32, address, gas, Log } from "../types";

export type Receipt = {
  status: uint32
  contractAddress: address
  gasUsed: gas
  logs: Log[]
}
