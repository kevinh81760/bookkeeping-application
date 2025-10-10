import { v4 as uuidv4 } from "uuid";
import { db } from "../03-services/dynamo.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function createFolder(req, res) {
  try {
    // User ID from JWT middleware (or fallback for testing)
    const userId = req.user?.userId || "test-user";

    // Extract fields from request body
    const { name, columns, categories } = req.body;

    // Validate folder name
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    // Validate columns array
    if (!Array.isArray(columns) || columns.length === 0) {
      return res.status(400).json({ error: "Columns must be a non-empty array of strings" });
    }

    // Validate categories array
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "Categories must be a non-empty array of strings" });
    }

    // Clean up input data (remove extra spaces)
    const cleanColumns = columns.map(c => c.trim());
    const cleanCategories = categories.map(c => c.trim());

    // Generate a unique folder ID
    const folderId = uuidv4();

    // Define parameters for DynamoDB
    const params = {
      TableName: process.env.DYNAMO_FOLDERS_TABLE,
      Item: {
        userId,                 // Partition key
        folderId,               // Sort key
        name: name.trim(),
        columns: cleanColumns,  // Array of strings
        categories: cleanCategories, // Array of strings
        createdAt: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(folderId)", // Prevents overwriting an existing folder
    };

    // Save the folder to DynamoDB
    await db.send(new PutCommand(params));

    // Send success response
    res.json({
      message: "Folder created successfully",
      folder: params.Item,
    });
  } catch (err) {
    // Log and return any errors
    console.error("Folder creation error:", err);
    res.status(500).json({
      error: "Failed to create folder",
      details: err.message,
    });
  }
}
