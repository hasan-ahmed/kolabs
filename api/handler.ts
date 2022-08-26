import { APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult, APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { LogInRequest } from "./interfaces/user/logIn";
import { SignUpRequest } from "./interfaces/user/signUp";
import { User } from "./models/user";
import { UserType } from "./models/userType";
import { getCompanyById } from "./repositories/companyRepository";
import { getUserByEmail } from "./repositories/userRepository";
import { addUserToCompany } from "./services/companyService";
import { logInUser, signUpNewUser, validateToken } from "./services/userService";

export const signUpHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("Received request to POST /signUp with body:", JSON.stringify(event.body, null, 2));
    try {
        let signUpRequest: SignUpRequest = JSON.parse(event.body);
        await signUpNewUser(signUpRequest);
        return {
          statusCode: 201,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: true,
                  message: `User with email ${signUpRequest.email} created successfully.`
              },
              null,
              2)
        };
    } catch (e) {
        console.error(e);
        return {
          statusCode: 400,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: false,
                  message: e.message
              },
              null,
              2)
      };
    }
}

export const logInHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("Received request to POST /signUp with body:", JSON.stringify(event.body, null, 2));
    try {
        let loginRequest: LogInRequest = JSON.parse(event.body);
        const token: string = await logInUser(loginRequest)
        return {
          statusCode: 200,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: true,
                  token: token
              },
              null,
              2)
        };
    } catch (e) {
        console.error(e);
        return {
          statusCode: 400,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: false,
                  message: e.message
              },
              null,
              2)
      };
    }
}

export const authorizerFuncHandler: APIGatewayAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise <APIGatewayAuthorizerResult> => {
    console.log(event);
    let result = await validateToken(event.authorizationToken);
    let effect: string = result["success"] ? "Allow" : "Deny";
    console.log("Token Validation Result: ", result["success"]);
    let principalId: string = result["subject"];

    let authResponse = {
        principalId: principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": event.methodArn
                }
            ]
        }
    };
    console.log(authResponse);
    return authResponse;
}

export const addUserToCompanyHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("Received request to POST /signUp with body:", JSON.stringify(event.body, null, 2));
    try {
        const body: object = JSON.parse(event.body);
        const userEmail: string = body["userEmail"] as string;
        const companyManagerEmail: string = event?.requestContext?.authorizer?.principalId != null && typeof event.requestContext.authorizer.principalId === 'string'? event.requestContext.authorizer.principalId : '';
        const companyManager: User = await getUserByEmail(companyManagerEmail);
        if (companyManager.userType != UserType.COMPANY_MANAGER) {
            throw new Error(`User with email ${companyManagerEmail} is not a company manager. Cannot perform this action.`)
        }
        const user: User = await getUserByEmail(userEmail);
        if (user == null) {
            throw new Error(`User with email ${userEmail} does not exists. They must create a Kolab account first.`)
        }
        const companyId: string = companyManager.companyId;
        await addUserToCompany(companyId, userEmail);
        return {
          statusCode: 200,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: true,
                  message: `User ${userEmail} has been added as a collaborator to company id ${companyId}`
              },
              null,
              2)
        };
    } catch (e) {
        console.error(e);
        return {
          statusCode: 400,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: false,
                  message: e.message
              },
              null,
              2)
      };
    }
}

