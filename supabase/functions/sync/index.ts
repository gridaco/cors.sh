// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const { name } = await req.json();
  const data = {
    message: `Hello ${name}!`,
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

import AWS from "aws-sdk";
import * as keygen from "../keygen";
import type { KeyInfo } from "./type";
import day from "dayjs";
import { Application } from "@/types/app";

const db = new AWS.DynamoDB.DocumentClient();

export default async function sync(application: Application) {
  const {
    id,
    signature_live,
    signature_test,
    allowed_origins,
    allowed_targets,
  } = application;

  // TODO: we are using application.id as the billing group, but we should
  // use the subscription id instead (in the future)
  const billing_group = id;

  const data = {
    // TODO: get plan data
    // for now, fixing it as "2023.t1", which is the pro plan
    plan: "2023.t1",
    allowedOrigins: allowed_origins,
    allowedTargets: allowed_targets,
  };

  // TODO: get subscription data. to calculate expires_at
  // for now, we are givving all keys a 3 year expiry
  const expires_at = day().add(3, "year").unix();

  // test
  sync_record(signature_test, "test", String(billing_group), expires_at, data);

  // live
  sync_record(signature_live, "live", String(billing_group), expires_at, data);
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

// shared db
export interface KeyInfo {
  key: string;
  plan: string;
  config: {
    allowed_origins: string[];
    allowed_targets: string[];
  };
  active: boolean;
  billing_group: string;
  expires_at: number;
  synced_at: number;
}
