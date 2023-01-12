import { DynamoDB } from "aws-sdk";
import * as day from "dayjs";
const db = new DynamoDB.DocumentClient();

const TABLE = process.env.DYNAMODB_TABLE_SERVICE_KEYS!;

export async function verify_synced_key(key: string): Promise<
  | {
      plan: "2023.t1";
    }
  | false
> {
  const record = await find(key);

  if (!record) {
    return false;
  }

  const { active, expires_at } = record;
  if (active && expires_at > day().unix()) {
    return {
      plan: "2023.t1",
    };
  }

  return false;
}

async function find(key: string): Promise<ServiceKeyInfo | null> {
  const { Item } = await db
    .get({
      TableName: TABLE,
      Key: {
        key: key,
      },
    })
    .promise();

  if (!Item) {
    return null;
  }

  return Item as ServiceKeyInfo;
}

interface ServiceKeyInfo {
  key: string;
  plan: string;
  config: {
    allowed_origins: string[];
    allowed_targets: string[];
  };
  active: boolean;
  expires_at: number;
  synced_at: number;
}
