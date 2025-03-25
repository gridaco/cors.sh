import { configure as serverlessExpress } from "@codegenie/serverless-express";
import { APIGatewayProxyHandler } from "aws-lambda";

import { app } from "./app";

export const handler: APIGatewayProxyHandler = serverlessExpress({ app });
