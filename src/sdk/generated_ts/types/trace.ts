import { hash, blknum, uint64, TraceAction, TraceResult, Function } from "../types";

export type Trace = {
  blockHash: hash
  blockNumber: blknum
  transactionHash: hash
  transactionIndex: blknum
  traceAddress: string[]
  subtraces: uint64
  type: string
  action: TraceAction
  result: TraceResult
  articulatedTrace: Function
  compressedTrace: string
}
