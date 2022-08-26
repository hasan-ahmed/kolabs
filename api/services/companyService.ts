import { Company } from "../models/company";
import { getCompanyById, putCompany } from "../repositories/companyRepository";
import { addCompanyToUser } from "./userService";

export const createCompany  = async(name: string, id: string) => {
    if (await getCompanyById(id) != null) {
        throw new Error(`Company with id ${id} already exists.`);
    }
    await putCompany({
        id: id,
        name: name,
        colabUsers: []
    });
};

export const addUserToCompany = async(companyId: string, email: string) => {
    let company: Company = await getCompanyById(companyId);
    if (company == null) {
        throw new Error(`Company with id ${companyId} already exists.`);
    }
    company.colabUsers.push(email);
    await putCompany(company);
    await addCompanyToUser(email, companyId);
};