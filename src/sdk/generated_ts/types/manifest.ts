import { blknum, PinnedChunk } from "../types";

export type Manifest = {
  indexFormat: string
  bloomFormat: string
  firstPin: blknum
  lastPin: blknum
  pins: PinnedChunk[]
}
