import AWS from "aws-sdk";
import * as keygen from "../keygen";
import type { KeyInfo } from "./type";
import type { Application } from "@prisma/client";

const db = new AWS.DynamoDB.DocumentClient();

export default async function sync(application: Application) {
  const { signature_live, signature_test, allowedOrigins, allowedTargets } =
    application;

  const data = {
    plan: "",
    allowedOrigins,
    allowedTargets,
  };

  // test
  sync_record(signature_test, "test", 0, data);

  // live
  sync_record(signature_live, "live", 0, data);
}

function sync_record(
  signature,
  type,
  expires_at,
  data: {
    plan: string;
    allowedOrigins: string[];
    allowedTargets: string[];
  }
) {
  const record: KeyInfo = {
    signature: keygen.sign(signature, type),
    plan: data.plan,
    config: {
      allowed_origins: data.allowedOrigins,
      allowed_targets: data.allowedTargets,
    },
    active: true,
    expires_at,
    synced_at: Date.now(),
  };

  // write to db
  return db
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
