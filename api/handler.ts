import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { SignUpRequest } from "./interfaces/user/signUp";
import { signUpNewUser } from "./services/userService";

export const signUpHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("Received request to POST /signUp with body:", JSON.stringify(event.body, null, 2));
    try {
        let signUpRequest: SignUpRequest = JSON.parse(event.body);
        await signUpNewUser(signUpRequest);
        return {
          statusCode: 204,
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
        return {
          statusCode: 400,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: false,
                  message: e.massage
              },
              null,
              2)
      };
    }
}
