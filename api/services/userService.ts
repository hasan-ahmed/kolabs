import { LogInRequest } from "../interfaces/user/logIn";
import { SignUpRequest } from "../interfaces/user/signUp";
import { User } from "../models/user";
import { UserType } from "../models/userType";
import { getUserByEmail, putUser } from "../repositories/userRepository";
import { createCompany } from "./companyService";
import {sign, verify} from "jsonwebtoken"
const JWT_SECRET: string = "6y@2%xZ8S*xTl^ze";

export const logInUser = async (logInRequest: LogInRequest): Promise<string> => {
    const user: User = await getUserByEmail(logInRequest.email);
    if (user == null) {
        throw new Error (`User with email ${logInRequest.email} does not exist`);
    }
    if (user.password != logInRequest.password) {
        throw new Error (`Could not log in ${logInRequest.email}. Password incorrect.`)
    }
    const jwtPayload: object = {
        sub: user.email,  
        userType: user.userType
    }
    if (user.companyId != null) {
        jwtPayload["companyId"] = user.companyId
    }
    const token: string = sign(jwtPayload, JWT_SECRET, {expiresIn: 86400});
    return token;
}

export const signUpNewUser = async (signUpRequest: SignUpRequest) => {
    if (signUpRequest.userType == UserType.COMPANY_MANAGER) {
        await createCompany(signUpRequest.companyName, signUpRequest.companyName.toLocaleLowerCase().replace(/\s/g, '-'));
    }
    let user: User = {
        email: signUpRequest.email,
        password: signUpRequest.password,
        active: true,
        userType: signUpRequest.userType
    }
    if (signUpRequest.userType == UserType.COMPANY_MANAGER) {
        user.companyId = signUpRequest.companyName.toLocaleLowerCase().replace(/\s/g, '-');
    }
    if (signUpRequest.userType == UserType.USER) {
        user.colabComps = []
    }
    await putUser(user)
}

export const loginUser = async (logInRequest: LogInRequest) => {
    let user: User = await getUserByEmail(logInRequest.email);
    if (user == null) {
        throw new Error(`User with email ${logInRequest.email} does not exist.`);
    }

}

export const validateToken = async(token: string): Promise<object> => {
    try {
        let decodedToken = verify(token, JWT_SECRET);
        return {
            success: true,
            subject: decodedToken["sub"]
        };
    } catch(err) {
        console.error(err, err.stack);
        return {
            success: false
        };
    }
};

export const addCompanyToUser = async(email: string, companyId: string) => {
    let user: User = await getUserByEmail(email);
    if (user == null) {
        throw new Error(`User with email ${email} does not exist.`);
    }
    user.colabComps.push(companyId);
    putUser(user);
}
