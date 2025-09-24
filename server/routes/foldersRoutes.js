import express from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../services/dynamo.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const router = express.Router();

// Step 1: Create a new folder with custom columns
router.post("/", async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT
    const { name, columns } = req.body;

    if (!name || !columns || !Array.isArray(columns)) {
      return res.status(400).json({ error: "Name and columns array are required" });
    }

    const folderId = uuidv4();

    // Step 2: Save folder info in DynamoDB
    const params = {
      TableName: process.env.DYNAMO_FOLDERS_TABLE,
      Item: {
        userId,
        folderId,
        name,
        columns, // array of strings
        createdAt: new Date().toISOString(),
      },
    };

    await db.send(new PutCommand(params));

    // Step 3: Respond with folder data
    res.json({
      message: "Folder created successfully",
      folder: params.Item,
    });
  } catch (err) {
    console.error("Folder creation error:", err);
    res.status(500).json({ error: "Failed to create folder" });
  }
});

export default router;
