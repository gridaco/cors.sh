// this uses dynamodb to read api key signatures
// signature types are..
// tmp - this is not stored in db.
// live / test - this is stored in db.

import AWS from "aws-sdk";
import crypto from "crypto";

const db = new AWS.DynamoDB.DocumentClient();

const CORS_API_KEY_HEADER = "x-cors-api-key";
const SIGNATURE_KEY = process.env.API_KEY_TEMP_HASH_SECRET;
const TABLE = process.env.DYNAMODB_TABLE_SERVICE_KEYS!;

module.exports.authorize = async (event) => {
  // get the api key from the header
  const key = event.headers[CORS_API_KEY_HEADER];

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function signature_from_key(key) {
  const mode = key.split("_")[0];
  const signature = key.split("_")[1];

  switch (mode) {
    case "tmp":
    case "live":
    case "test":
  }
}

async function validate_tmp_key(signature: string) {
  // decode signature that uses HMAC-SHA256
}

async function validate_key(signature: string) {}

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
