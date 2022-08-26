import { CreateFeatureRequest } from "../interfaces/featureRequest/createFeature";
import { FeatureRequest, FeatureRequestStatus } from "../models/featureRequest";
import { v4 as uuidv4 } from 'uuid'
import { putFeatureRequest } from "../repositories/featureRequestRepository";
import { getCompanyById } from "../repositories/companyRepository";
import { Company } from "../models/company";

export const createNewFeatureRequest = async (createFeatureRequest: CreateFeatureRequest, userEmail: string) => {
    const company: Company = await getCompanyById(createFeatureRequest.companyId);
    if (!company.colabUsers.includes(userEmail)) {
        throw new Error(`User ${userEmail} is not listed as a collaborator for company ${createFeatureRequest.companyId}`);
    }
    const featureRequest: FeatureRequest = {
        id: uuidv4(),
        title: createFeatureRequest.title,
        description: createFeatureRequest.description,
        companyId: createFeatureRequest.companyId,
        createdAt: Date.now(),
        createdBy: userEmail,
        upvotes: [],
        comments: [],
        labels: [],
        aiLabelsSuggestions: [],
        status: FeatureRequestStatus.NEW
    }
    await putFeatureRequest(featureRequest);
}