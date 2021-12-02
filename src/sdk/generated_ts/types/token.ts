import { address, wei, uint64 } from "../types";

export type Token = {
    holder: address
    balance: wei
    address: address
    name: string
    symbol: string
    decimals: uint64
    isContract: boolean
    isErc20: boolean
    isErc721: boolean
}