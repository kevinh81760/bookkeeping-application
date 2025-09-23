// routes/tokens.js
import express from "express";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../services/dynamo.js";

const router = express.Router();

// 🔹 Write test token
router.get("/test-write", async (req, res) => {
  try {
    await db.send(new PutCommand({
      TableName: "Tokens",
      Item: {
        userId: "test_user",
        googleAccessToken: "test_access",
        googleRefreshToken: "test_refresh",
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
      }
    }));

    res.json({ success: true, message: "✅ Wrote test_user to Tokens table" });
  } catch (err) {
    console.error("DynamoDB Write Error:", err);
    res.status(500).json({ error: "Failed to write test item" });
  }
});

// 🔹 Read test token
router.get("/test-read", async (req, res) => {
  try {
    const result = await db.send(new GetCommand({
      TableName: "Tokens",
      Key: { userId: "test_user" }
    }));

    res.json({ success: true, item: result.Item });
  } catch (err) {
    console.error("DynamoDB Read Error:", err);
    res.status(500).json({ error: "Failed to read test item" });
  }
});

export default router;
