import { History23task } from "./history23task";
import { Save } from "./save";
import { Spend } from "./spend";

export interface Finances {
    income: number,
    saves: Save[],
    spends: Spend[],
    history23task?: History23task
}