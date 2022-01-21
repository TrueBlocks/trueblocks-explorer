import { blknum, timestamp, address, topic, bytes, ArticulatedLog } from "../types";

export type Log = {
  blockNumber: blknum
  transactionIndex: blknum
  logIndex: blknum
  timestamp: timestamp
  address: address
  topics: topic[]
  data: bytes
  articulatedLog: ArticulatedLog
  compressedLog: string
}
