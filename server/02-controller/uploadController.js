import { uploadToS3, getSignedS3Url } from "../03-services/s3.js";
import { saveReceipt, getFolderColumns } from "../03-services/dynamo.js";
import { analyzeReceipt } from "../03-services/openai.js";

export async function uploadSingle(req, res) {
  try {
    const file = req.file;
    const userId = req.user?.userId || "test-user";
    const { folderId } = req.body;
    
    console.log(`📤 Upload request - User: ${userId}, Folder: ${folderId}`);

    // Validate file input
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!folderId) {
      return res.status(400).json({ error: "Missing folderId in request" });
    }

    // Upload file to S3
    const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);
    console.log("✅ Uploaded to S3:", s3Path);

    // Generate signed URL for AI analysis
    const signedUrl = await getSignedS3Url(s3Path);
    console.log("✅ Generated signed URL");

    // Fetch folder info (columns + categories)
    console.log(`🔍 Looking up folder: userId=${userId}, folderId=${folderId}`);
    const folderData = await getFolderColumns(folderId, userId);

    if (!folderData) {
      console.error(`❌ Folder not found in DynamoDB: userId=${userId}, folderId=${folderId}`);
      return res.status(404).json({ 
        error: "Folder not found",
        details: `No folder with ID ${folderId} exists for user ${userId}. Please create the folder first.`
      });
    }
    
    console.log(`✅ Found folder with ${folderData.columns.length} columns`);

    const columns = folderData.columns || [];
    const categories = folderData.categories || [];

    if (columns.length === 0) {
      console.error(`❌ No columns found for folder ${folderId}`);
      return res.status(404).json({ error: "No columns found for this folder" });
    }

    // Analyze receipt with GPT
    console.log(`🤖 Analyzing receipt with OpenAI...`);
    const receiptJson = await analyzeReceipt(signedUrl, columns, categories);
    console.log("✅ AI analysis complete:", receiptJson);

    // Save to DynamoDB (don’t redeclare with const)
    const savedReceipt = await saveReceipt(
      userId,
      folderId,
      file.originalname,
      s3Path,
      receiptJson
    );

    console.log("✅ Receipt saved to DynamoDB:", savedReceipt.receiptId);

    res.json({
      success: true,
      message: `Uploaded ${file.originalname} and processed successfully!`,
      savedReceipt,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      error: "Upload failed",
      details: err.message,
    });
  }
}
