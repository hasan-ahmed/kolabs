import { UserType } from "../../models/userType";

export interface SignUpRequest {
    email: string;
    name: string;
    phone: string;
    password: string;
    userType: UserType;
    companyName?: string;
}