import { uploadToS3, getSignedS3Url } from "../03-services/s3.js";
import { saveReceipt, getFolderColumns } from "../03-services/dynamo.js";
import { analyzeReceipt } from "../03-services/openai.js";

export async function uploadSingle(req, res) {
  try {
    const file = req.file;
    const userId = req.user?.userId || "test-user";
    const { folderId } = req.body;

    // Validate file input
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!folderId) {
      return res.status(400).json({ error: "Missing folderId in request" });
    }

    // Upload file to S3
    const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);
    console.log("Uploaded to S3:", s3Path);

    // Generate signed URL for AI analysis
    const signedUrl = await getSignedS3Url(s3Path);
    console.log("Signed URL:", signedUrl);

    // Fetch folder info (columns + categories)
    const folderData = await getFolderColumns(folderId, userId);

    if (!folderData) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const columns = folderData.columns || [];
    const categories = folderData.categories || [];

    if (columns.length === 0) {
      return res.status(404).json({ error: "No columns found for this folder" });
    }

    // Analyze receipt with GPT
    const receiptJson = await analyzeReceipt(signedUrl, columns, categories);
    console.log("Receipt JSON:", receiptJson);

    // Save to DynamoDB (don’t redeclare with const)
    const savedReceipt = await saveReceipt(
      userId,
      folderId,
      file.originalname,
      s3Path,
      receiptJson
    );

    console.log("Saved receipt:", savedReceipt);

    res.json({
      success: true,
      message: `Uploaded ${file.originalname} to S3 and processed successfully!`,
      folderId,
      userId,
      columns,
      categories,
      savedReceipt,
    });
  } catch (err) {
    console.error("S3 Single Upload Error:", err);
    res.status(500).json({
      error: "Upload failed",
      details: err.message,
    });
  }
}
