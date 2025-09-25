import { uploadToS3, getSignedS3Url } from "../03-services/s3.js";
import { saveReceipt, getFolderColumns } from "../03-services/dynamo.js";
import { analyzeReceipt } from "../03-services/openai.js";

export async function uploadSingle(req, res) {
    try {
      const file = req.file;
      const { userId, folderId } = req.body;
  
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      // Upload to S3
      const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);
  
      // Get folder columns
      const columns = await getFolderColumns(folderId);
      if (!columns.length) {
        return res.status(404).json({ error: "No columns found for this folder" });
      }
  
      // Generate signed URL
      const signedUrl = await getSignedS3Url(s3Path);
      console.log("Signed URL:", signedUrl);
  
      // Analyze receipt
      //const receiptJson = await analyzeReceipt(signedUrl, columns);
  
      // Save everything in Dynamo (metadata + GPT JSON together)
      // const savedReceipt = await saveReceipt(userId, folderId, file.originalname, s3Path, receiptJson);
  
      res.json({
        success: true,
        message: `Uploaded ${file.originalname} to S3 and saved in DB!`,
      });
    } catch (err) {
      console.error("S3 Single Upload Error:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }
  
  
// Handle batch upload
export async function uploadBatch(req, res) {
  try {
    const files = req.files;
    const userId = req.body.userId;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Upload all files to S3 + save in DynamoDB
    const uploadTasks = files.map(async (file) => {
      const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      return await saveReceipt(userId, file.originalname, s3Path);
    });

    const receipts = await Promise.all(uploadTasks);

    res.json({
      success: true,
      message: `Uploaded ${receipts.length} files to S3 and saved in DB!`,
      receipts,
    });

    console.log(`Saved ${receipts.length} receipts`);
  } catch (err) {
    console.error("S3 Batch Upload Error:", err);
    res.status(500).json({ error: "Batch upload failed" });
  }
}
