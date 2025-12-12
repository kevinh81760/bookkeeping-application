import { v4 as uuidv4 } from "uuid";
import { db } from "../03-services/dynamo.js";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function createFolder(req, res) {
  try {
    // User ID from JWT middleware (or fallback for testing)
    const userId = req.user?.userId || "test-user";

    // Extract fields from request body
    const { name, categories, folderId } = req.body;

    // Validate folder name
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    // Validate categories array (now expects objects with name, type, required)
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "Categories must be a non-empty array" });
    }

    // Validate category structure
    for (const cat of categories) {
      if (!cat.name || typeof cat.name !== "string") {
        return res.status(400).json({ error: "Each category must have a name" });
      }
      if (!cat.type || !["Text", "Number", "Date"].includes(cat.type)) {
        return res.status(400).json({ error: "Each category must have a valid type (Text, Number, or Date)" });
      }
    }

    // Extract column names from categories for AI processing
    const columns = categories.map(cat => cat.name.trim());

    // Use provided folderId or generate new one (for backward compatibility)
    const finalFolderId = folderId || uuidv4();
    
    console.log(`📁 Creating folder for user ${userId} with ID: ${finalFolderId}`);

    // Define parameters for DynamoDB
    const params = {
      TableName: process.env.DYNAMO_FOLDERS_TABLE,
      Item: {
        userId,                 // Partition key
        folderId: finalFolderId, // Sort key - use the final ID
        name: name.trim(),
        columns,                // Array of column names (derived from categories)
        categories,             // Array of category objects {name, type, required}
        createdAt: new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(folderId)", // Prevents overwriting an existing folder
    };

    // Save the folder to DynamoDB
    await db.send(new PutCommand(params));
    console.log(`✅ Folder ${finalFolderId} saved to DynamoDB`);

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

// Get all folders for a user
export async function getFolders(req, res) {
  try {
    // User ID from JWT middleware (or fallback for testing)
    const userId = req.user?.userId || "test-user";

    // Query DynamoDB for all folders belonging to this user
    const params = {
      TableName: process.env.DYNAMO_FOLDERS_TABLE,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false, // Sort by most recent first
    };

    const result = await db.send(new QueryCommand(params));

    // Return folders array (or empty array if none found)
    res.json({
      folders: result.Items || [],
      count: result.Items?.length || 0,
    });
  } catch (err) {
    console.error("Error fetching folders:", err);
    res.status(500).json({
      error: "Failed to fetch folders",
      details: err.message,
    });
  }
}

