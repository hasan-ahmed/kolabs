import { DynamoDB } from "aws-sdk";
import * as AWS from "aws-sdk";
import {AttributeMap, PutItemInput, ScanInput} from "aws-sdk/clients/dynamodb";
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

export const getFeatureRequestsbyCompanyId = async(companyId: string): Promise<FeatureRequest[]> => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        // Specify which items in the results are returned.
        FilterExpression: "companyId = :companyId",
        // Define the expression attribute value, which are substitutes for the values you want to compare.
        ExpressionAttributeValues: {
            ":companyId": companyId
        },
        TableName: "KolabsFeatureRequests",
    };
    console.log("params", params);
    let res: any = await documentClient.scan(params).promise();
    console.log("res", res);
    return res.Items;
}