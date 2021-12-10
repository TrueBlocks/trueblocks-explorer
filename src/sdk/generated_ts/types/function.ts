import { Parameter } from "../types";

export type Function = {
  name: string
  type: string
  signature: string
  encoding: string
  inputs: Parameter[]
  outputs: Parameter[]
}
