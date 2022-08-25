import { UserType } from "./userType";

export interface User {
    email: string;
    password: string;
    userType: UserType;
    active: boolean;
    companyId?: string;
}