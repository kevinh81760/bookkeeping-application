import express from "express";
import multer from "multer";
import { uploadSingle } from "../02-controller/uploadController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/single", upload.single("file"), uploadSingle);

export default router;
