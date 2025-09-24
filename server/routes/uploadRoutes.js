import express from "express";
import multer from "multer";
import { uploadToS3 } from "../services/s3.js"; 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    // Upload to S3 using the helper
    const s3Path = await uploadToS3(file.buffer, file.originalname, file.mimetype);

    res.json({
      success: true,
      message: `Uploaded ${file.originalname} to S3!`,
      location: s3Path
    });

    console.log(req.file);
  } catch (err) {
    console.error("S3 Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
