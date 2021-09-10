import { Finances } from "./financesData";
import { UserPersonal } from "./userPersonal";

export interface User extends Finances,UserPersonal {
    id: number,
    balance: number,
    expenses: number,
    lastVisit: number
}