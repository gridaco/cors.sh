import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import * as keygen from "./keygen";
import day from "dayjs";
import { Application } from "@/types/app";

const client = new DynamoDBClient();

// TODO: replace me
const TABLE = process.env.DYNAMODB_TABLE_SERVICE_KEYS!

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

async function sync_record(
  signature: string,
  type: "live" | "test",
  billing_group: string,
  expires_at: number,
  data: {
    plan: string;
    allowedOrigins: string[] | null;
    allowedTargets: string[] | null;
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
  // return client
  //   .put({
  //     TableName: process.env.DYNAMODB_TABLE_SERVICE_KEYS!,
  //     Item: record,
  //   })
  //   .promise();
  const command = new PutItemCommand({
    TableName: TABLE,
    Item: {
      key: {
        S: record.key,
      },
      plan: {
        S: record.plan,
      },
      config: {
        M: {
          allowed_origins: {
            SS: record.config.allowed_origins ?? [],
          },
          allowed_targets: {
            SS: record.config.allowed_targets ?? [],
          },
        },
      },
      active: {
        BOOL: record.active,
      },
      billing_group: {
        S: record.billing_group,
      },
      expires_at: {
        N: String(record.expires_at),
      },
      synced_at: {
        N: String(record.synced_at),
      },
    },
  });

  return await client.send(command);
}


export async function activate(id: string, active: boolean) {
  // update "active" field of the key
  // write to db

  const command = new UpdateItemCommand({
    TableName: TABLE,
    Key: {
      id: {
        S: id,
      },
    },
    UpdateExpression: "set active = :active",
    ExpressionAttributeValues: {
      ":active": {
        BOOL: active,
      },
    },
  });

  return await client.send(command);
}

// shared db
export interface KeyInfo {
  key: string;
  plan: string;
  config: {
    allowed_origins: string[] | null;
    allowed_targets: string[] | null;
  };
  active: boolean;
  billing_group: string;
  expires_at: number;
  synced_at: number;
}
