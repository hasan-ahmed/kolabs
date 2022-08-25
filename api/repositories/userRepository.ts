import { DynamoDB } from "aws-sdk";
import { User } from "../models/user";
import * as AWS from "aws-sdk";
import {AttributeMap, GetItemInput, PutItemInput} from "aws-sdk/clients/dynamodb";

export const putNewUser = async ( user: User): Promise<boolean> => {
    let marshalledUser: AttributeMap = AWS.DynamoDB.Converter.marshall(user);
    const params: PutItemInput = {
        TableName: "KolabsUsers",
        Item: marshalledUser
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

export const getUserByEmail = async (email: string): Promise<User> => {
    const params: GetItemInput = {
        Key: {
            'email': {S: email}
        },
        TableName: 'KolabsUsers'
    };
    let getItemPromise = new DynamoDB().getItem(params).promise();
    let data: DynamoDB.GetItemOutput = await getItemPromise;
    if (data.Item != null) {
        return DynamoDB.Converter.unmarshall(data.Item) as User;
    } else {
        return null;
    }
};
