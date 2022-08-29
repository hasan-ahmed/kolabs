import { UserType } from "aws-sdk/clients/workdocs";

export interface FeatureRequest {
    id: string;
    title: string;
    description: string;
    companyId: string;
    createdAt: number;
    createdBy: string;
    upvotes: string[];
    comments: FeatureRequestComment[];
    aiLabelsSuggestions: string;
    status: FeatureRequestStatus;
}

export enum FeatureRequestStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CLOSED = "CLOSED"
}

export interface FeatureRequestComment {
    createdAt: number;
    comment: string;
    user: string;
    userType: UserType;
}

export interface FetureRequestUpvote {
    cretedAt: number;
    user: string;
    userType: UserType;
}