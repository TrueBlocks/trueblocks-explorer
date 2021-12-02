import { blknum, address, timestamp } from "../types";

export type Appearance = {
    blockNumber: blknum
    transactionIndex: blknum
    address: address
    name: string
    timestamp: timestamp
    date: string
}