import { CreateFeatureRequest } from "../interfaces/featureRequest/createFeature";
import { FeatureRequest, FeatureRequestStatus } from "../models/featureRequest";
import { v4 as uuidv4 } from 'uuid'
import { getFeatureRequestById, getFeatureRequestsbyCompanyId, putFeatureRequest } from "../repositories/featureRequestRepository";
import { getCompanyById } from "../repositories/companyRepository";
import { Company } from "../models/company";
import { getUserByEmail } from "../repositories/userRepository";
import { User } from "../models/user";
import { CommentFeatureRequest } from "../interfaces/featureRequest/commentFeature";

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

export const getAllFeatureReqeustsForCompany  = async (companyId: string): Promise<FeatureRequest[]> => {
    return await getFeatureRequestsbyCompanyId(companyId);
}

export const upvoteAFeatureRequest = async (featureRequestId: string, userEmail: string) => {
    let featureRequest: FeatureRequest = await getFeatureRequestById(featureRequestId);
    if (featureRequest == null) {
        throw new Error("The desired feature request does not exist");
    }
    if (!featureRequest.upvotes.includes(userEmail)) {
        featureRequest.upvotes.push(userEmail)
    }
    await putFeatureRequest(featureRequest);
}

export const addCommentToFeatureRequest = async (commentFeatureRequest: CommentFeatureRequest, userEmail: string) => {
    let featureRequest: FeatureRequest = await getFeatureRequestById(commentFeatureRequest.id);
    if (featureRequest == null) {
        throw new Error("The desired feature request does not exist");
    }
    let user: User = await getUserByEmail(userEmail);
    if (user == null) {
        throw new Error("User does not exist");
    }
    featureRequest.comments.push(
        {
            createdAt: Date.now(),
            comment: commentFeatureRequest.comment,
            user: userEmail,
            userType: user.userType
        }
    )
    await putFeatureRequest(featureRequest);
}