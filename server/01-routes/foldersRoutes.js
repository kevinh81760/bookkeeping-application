// 01-routes/foldersRoutes.js
import express from "express";
import { createFolder, getFolders } from "../02-controller/folderController.js";

const router = express.Router();

router.post("/create", createFolder);
router.get("/getFolders", getFolders);

export default router;
