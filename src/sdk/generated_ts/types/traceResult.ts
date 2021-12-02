import { address, bytes, gas } from "../types";

export type TraceResult = {
    newContract: address
    code: bytes
    gasUsed: gas
    output: bytes
}