import { blknum, address, topic, bytes, Function, timestamp } from "../types";

export type Log = {
    blockNumber: blknum
    transactionIndex: blknum
    address: address
    logIndex: blknum
    topics: topic[]
    data: bytes
    articulatedLog: Function
    compressedLog: string
    timestamp: timestamp
}