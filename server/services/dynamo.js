import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
dotenv.config();

// Step 1: Create DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Step 2: Wrap client with DocumentClient (auto JSON marshalling)
export const db = DynamoDBDocumentClient.from(client);


export async function saveRefreshTokenForUser(userId, refreshToken) {
  const params = {
    TableName: process.env.DYNAMO_TOKENS_TABLE,
    Item: {
      userId,
      provider: "google", // useful if you add other providers later
      refresh_token: refreshToken,
      updatedAt: new Date().toISOString(),
    },
  };
  await db.send(new PutCommand(params));
  return params.Item;
}


export async function getRefreshTokenForUser(userId) {
  const params = {
    TableName: process.env.DYNAMO_TOKENS_TABLE,
    Key: { userId, provider: "google" },
  };
  const result = await db.send(new GetCommand(params));
  return result.Item ? result.Item.refresh_token : null;
}


export async function deleteRefreshTokenForUser(userId) {
  const params = {
    TableName: process.env.DYNAMO_TOKENS_TABLE,
    Key: { userId, provider: "google" },
  };
  await db.send(new DeleteCommand(params));
}


export async function saveUser(profile) {
  const params = {
    TableName: process.env.DYNAMO_USERS_TABLE,
    Item: {
      userId: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      updatedAt: new Date().toISOString(),
    },
  };
  await db.send(new PutCommand(params));
  return params.Item;
}

export async function saveReceipt(userId, fileName, s3Path) {
  const receiptRecord = {
    userId,
    receiptId: uuidv4(),
    imageUri: s3Path,
    fileName,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.DYNAMO_RECEIPTS_TABLE,
    Item: receiptRecord,
  };

  await db.send(new PutCommand(params));
  return receiptRecord;
}
