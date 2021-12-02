import { address, gas, bytes } from "../types";

export type TraceAction = {
    from: address
    to: address
    gas: gas
    input: bytes
    callType: string
    refundAddress: address
}