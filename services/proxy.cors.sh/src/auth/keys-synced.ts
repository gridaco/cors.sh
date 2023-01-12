import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

const TABLE = process.env.DYNAMODB_TABLE_SERVICE_KEYS!;

export async function verify_synced_key(signature: string) {
  const key = await find(signature);

  if (!key) {
    return false;
  }

  const { active, expires_at } = key;
  return active && expires_at > Date.now();
}

async function find(signature: string): Promise<ServiceKeyInfo | null> {
  const { Item } = await db
    .get({
      TableName: TABLE,
      Key: {
        signature: signature,
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
