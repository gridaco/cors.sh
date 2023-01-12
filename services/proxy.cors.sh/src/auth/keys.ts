import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

const TABLE = process.env.DYNAMODB_TABLE_SERVICE_KEYS!;

export function keyinfo(key: string): {
  signature: string;
  mode: "temp" | "live" | "test" | "v2022";
} {
  const mode = key.split("_")[0];
  const signature = key.split("_")[1];

  switch (mode) {
    case "temp":
    case "live":
    case "test": {
      return {
        mode,
        signature,
      };
    }
    default: {
      // legacy key
      return {
        mode: "v2022",
        signature: key,
      };
    }
  }
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
  signature: string;
  plan: string;
  config: {
    allowed_origins: string[];
    allowed_targets: string[];
  };
  active: boolean;
  synced_at: number;
}
