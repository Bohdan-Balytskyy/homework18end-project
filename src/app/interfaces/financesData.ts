import { Save } from "./save";
import { Spend } from "./spend";

export interface Finances {
    income: number,
    saves: Save[],
    spends: Spend[]
}