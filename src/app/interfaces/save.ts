import { Spend } from "./spend";
export interface Save extends Spend {
    active: boolean;
}