import express from "express";
import multer from "multer";
import { uploadSingle, uploadBatch } from "../02-controller/uploadController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/single", upload.single("file"), uploadSingle);
router.post("/batch", upload.array("files", 10), uploadBatch);

export default router;
