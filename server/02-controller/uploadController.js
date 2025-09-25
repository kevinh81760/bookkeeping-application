import { uploadToS3 } from "../03-services/s3.js";
import { saveReceipt } from "../03-services/dynamo.js";

// Handle single file upload
export async function uploadSingle(req, res) {
  try {
    const file = req.file;
    const userId = req.body.userId; // client must send this

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to S3
    const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);

    // Save record in DynamoDB
    const receiptRecord = await saveReceipt(userId, file.originalname, s3Path);

    res.json({
      success: true,
      message: `Uploaded ${file.originalname} to S3 and saved in DB!`,
      receipt: receiptRecord,
    });

    console.log("Saved single receipt:", receiptRecord);
  } catch (err) {
    console.error("S3 Single Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
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
