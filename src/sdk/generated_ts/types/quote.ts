import { timestamp, double, date } from "../types";

export type Quote = {
    timestamp: timestamp
    close: double
    date: date
    name: string
}