import { hash } from "bcrypt";
import { SignUpRequest } from "../interfaces/user/signUp";
import { User } from "../models/user";
import { UserType } from "../models/userType";
import { getUserByEmail, putNewUser } from "../repositories/userRepository";
import { createCompany } from "./companyService";

export const signUpNewUser = async (signUpRequest: SignUpRequest) => {
    if (await getUserByEmail(signUpRequest.email) != null) {
        throw new Error(`User with email ${signUpRequest.email} already exists.`);
    }
    if (signUpRequest.userType == UserType.COMPANY_MANAGER) {
        await createCompany(signUpRequest.name, signUpRequest.companyName.toLocaleLowerCase().replace(/\s/g, '-'));
    }
    let user: User = {
        email: signUpRequest.email,
        password: signUpRequest.password,
        active: true,
        userType: signUpRequest.userType
    }
    if (signUpRequest.userType == UserType.COMPANY_MANAGER) {
        user.companyId = signUpRequest.name.toLocaleLowerCase().replace(/\s/g, '-');
    }
    await putNewUser(user)
}