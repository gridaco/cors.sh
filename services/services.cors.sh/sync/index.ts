import AWS from "aws-sdk";
import type { KeyInfo } from "./type";
import type { Application } from "@prisma/client";

const db = new AWS.DynamoDB.DocumentClient();

export default async function sync(application: Application) {
  const { id, name, allowedOrigins, allowedTargets } = application;

  const record: KeyInfo = {
    signature: id,
    plan: "",
    config: {
      allowed_origins: allowedOrigins,
      allowed_targets: allowedTargets,
    },
    active: true,
    synced_at: Date.now(),
  };

  // write to db
  await db
    .put({
      TableName: process.env.DYNAMODB_TABLE_SERVICE_KEYS!,
      Item: record,
    })
    .promise();
}

export async function activate(id: string, active: boolean) {
  // update "active" field of the key
  // write to db

  return db.update({
    TableName: process.env.DYNAMODB_TABLE_SERVICE_KEYS!,
    Key: {
      id,
    },
    UpdateExpression: "set active = :active",
    ExpressionAttributeValues: {
      ":active": active,
    },
  });
}
