import { DynamoDB } from "aws-sdk";
import * as AWS from "aws-sdk";
import {AttributeMap, GetItemInput, PutItemInput} from "aws-sdk/clients/dynamodb";
import { Company } from "../models/company";

export const putNewCompany = async ( company: Company): Promise<boolean> => {
    let marshalledCompany: AttributeMap = AWS.DynamoDB.Converter.marshall(company);
    const params: PutItemInput = {
        TableName: "KolabsCompanies",
        Item: marshalledCompany
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

export const getCompanyById = async (id: string): Promise<Company> => {
    const params: GetItemInput = {
        Key: {
            'id': {S: id}
        },
        TableName: 'KolabsCompanies'

    };
    let getItemPromise = new DynamoDB().getItem(params).promise();
    let data: DynamoDB.GetItemOutput = await getItemPromise;
    if (data.Item != null) {
        return DynamoDB.Converter.unmarshall(data.Item) as Company;
    } else {
        return null;
    }
}
