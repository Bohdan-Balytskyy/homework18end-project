import { Spend } from "./spend";

export interface Statistic {
    date: number,
    expenses: number,
    spends: Spend[]
}