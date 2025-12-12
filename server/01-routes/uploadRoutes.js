import express from "express";
import multer from "multer";
import { uploadSingle } from "../02-controller/uploadController.js";

const router = express.Router();

// Configure multer with file size limits and type validation
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post("/single", upload.single("file"), uploadSingle);

export default router;
