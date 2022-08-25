import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

export const signUpHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    return {
          statusCode: 200,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(
              {
                  success: true,
                  message: "Hello World!"
              },
              null,
              2)
      };

}
