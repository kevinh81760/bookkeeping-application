import express from "express";
import multer from "multer";
import { uploadToS3 } from "../03-services/s3.js"; 
import { saveReceipt } from "../03-services/dynamo.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post("/single", upload.single("file"), async (req, res) => {
  try {

    const file = req.file;
    const userId = req.body.userId; // client must send this
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);

    const receiptRecord = await saveReceipt(userId, file.originalname, s3Path);

    res.json({
      success: true,
      message: `Uploaded ${file.originalname} to S3 and saved in DB!`,
      receipt: receiptRecord,
    });

    console.log("Saved single receipt:", receiptRecord);
  } catch (err) {
    // Step 6: Handle errors
    console.error("S3 Single Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});


router.post("/batch", upload.array("files", 10), async (req, res) => {
  try {
    // Step 2: Get uploaded files + userId
    const files = req.files;
    const userId = req.body.userId;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Step 3: Upload to S3 + save in DynamoDB for each file (in parallel)
    const uploadTasks = files.map(async (file) => {
      const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      return await saveReceipt(userId, file.originalname, s3Path);
    });

    // Step 4: Wait for all tasks to finish
    const receipts = await Promise.all(uploadTasks);

    // Step 5: Send back success response
    res.json({
      success: true,
      message: `Uploaded ${receipts.length} files to S3 and saved in DB!`,
      receipts,
    });

    console.log(`Saved ${receipts.length} receipts`);
  } catch (err) {
    // Step 6: Handle errors
    console.error("S3 Batch Upload Error:", err);
    res.status(500).json({ error: "Batch upload failed" });
  }
});

export default router;
