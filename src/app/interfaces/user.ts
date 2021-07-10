import { Finances } from "./financesData"; 

export interface User extends Finances {
    id: number,
    name: string,
    surname: string,
    password: string,
    email: string,
    balance: string,
    expenses: string,
}