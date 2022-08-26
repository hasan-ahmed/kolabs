import { DynamoDB } from "aws-sdk";
import * as AWS from "aws-sdk";
import {AttributeMap, PutItemInput} from "aws-sdk/clients/dynamodb";
import { FeatureRequest } from "../models/featureRequest";

export const putFeatureRequest = async ( featureRequest: FeatureRequest): Promise<boolean> => {
    let marshalledFeatureRequest: AttributeMap = AWS.DynamoDB.Converter.marshall(featureRequest);
    const params: PutItemInput = {
        TableName: "KolabsFeatureRequests",
        Item: marshalledFeatureRequest
    };
    let putItemPromise = new DynamoDB().putItem(params).promise();
    try {
        await putItemPromise;
        return true;
    } catch (err) {
        console.error(err, err.stack);
        return false;
    }
};