import express from "express";
import { exportToGoogleSheets, downloadCSV } from "../02-controller/sheetController.js";

const router = express.Router();

router.post("/export", exportToGoogleSheets);
router.post("/download-csv", downloadCSV);

export default router;
