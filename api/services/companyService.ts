import { getCompanyById, putNewCompany } from "../repositories/companyRepository";

export const createCompany  = async(name: string, id: string) => {
    if (await getCompanyById(id) != null) {
        throw new Error(`Company with id ${id} already exists.`);
    }
    await putNewCompany({
        id: id,
        name: name
    });
};