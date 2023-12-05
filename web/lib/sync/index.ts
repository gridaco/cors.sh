import AWS from "aws-sdk";
import * as keygen from "../keygen";
import type { KeyInfo } from "./type";
import type { Application } from "@prisma/client";
import day from "dayjs";

const db = new AWS.DynamoDB.DocumentClient();

export default async function sync(application: Application) {
  const { id, signature_live, signature_test, allowedOrigins, allowedTargets } =
    application;

  // TODO: we are using application.id as the billing group, but we should
  // use the subscription id instead (in the future)
  const billing_group = id;

  const data = {
    // TODO: get plan data
    // for now, fixing it as "2023.t1", which is the pro plan
    plan: "2023.t1",
    allowedOrigins,
    allowedTargets,
  };

  // TODO: get subscription data. to calculate expires_at
  // for now, we are givving all keys a 3 year expiry
  const expires_at = day().add(3, "year").unix();

  // test
  sync_record(signature_test, "test", billing_group, expires_at, data);

  // live
  sync_record(signature_live, "live", billing_group, expires_at, data);
}

function sync_record(
  signature: string,
  type: "live" | "test",
  billing_group: string,
  expires_at: number,
  data: {
    plan: string;
    allowedOrigins: string[];
    allowedTargets: string[];
  }
) {
  const record: KeyInfo = {
    key: keygen.sign(signature, type).token,
    plan: data.plan,
    config: {
      allowed_origins: data.allowedOrigins,
      allowed_targets: data.allowedTargets,
    },
    active: true,
    billing_group,
    expires_at,
    synced_at: day().unix(),
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
