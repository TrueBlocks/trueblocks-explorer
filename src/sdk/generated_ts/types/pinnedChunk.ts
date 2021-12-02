import { ipfshash } from "../types";

export type PinnedChunk = {
    fileName: string
    bloomHash: ipfshash
    indexHash: ipfshash
}