import { Finances } from "./financesData"; 

export interface History extends Finances {
    date: number,
    balance: number,
    expenses: number,
}